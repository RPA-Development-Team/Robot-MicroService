const jwt = require('jsonwebtoken');
const request = require('request');
const { KCIClientId, KCIClientSecret, KCUrl } = require('../config/KeycloakConfig');


const verifyToken = (req, res, next) => {
    // assumes bearer token is passed as an authorization header
    if (req.headers.authorization) {
      let token;
      if (req.headers.authorization.split(' ')[0] === 'Bearer') {
          token = req.headers.authorization.split(' ')[1];
      }

      const options = {
        method: 'POST',
        url: `${KCUrl}/realms/orch/protocol/openid-connect/token/introspect`,
        form: {
          grant_type: 'client_credentials',
          client_id: KCIClientId,
          client_secret: KCIClientSecret,
          token: token
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
  
      // send a request to the userinfo endpoint on keycloak
      request(options, (error, response, body) => {
        if (error) throw new Error(error);
        
        // if the request status isn't "OK", the token is invalid
        if (response.statusCode !== 200) {
          res.status(401).json({
            error: `unauthorized`,
          });
        }
        // the token is valid pass request onto next function
        else {
          decodedToken = jwt.decode(token);
          
          if (!decodedToken) {
            return res.status(401).json({
              error: `unauthorized`,
            });
          }

          decodedUser = {
            uuid: decodedToken.sub,
            username: decodedToken.preferred_username,
            firstName: decodedToken.given_name,
            lastName: decodedToken.family_name,
          }
          req.decodedUser = decodedUser;
          next();
        }
      });
    } else {
      // there is no token, don't process request further
        res.status(401).json({
            error: `unauthorized`,
        });
    }
};


module.exports = verifyToken;