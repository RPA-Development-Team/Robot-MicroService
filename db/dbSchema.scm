CREATE TABLE "Robot" (
    "id"            SERIAL          NOT NULL,
    "createdAt"     TIMESTAMP(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3)    NOT NULL,
    "robotName"     VARCHAR(255)    NOT NULL,
    "robotAddress"  VARCHAR(255)    NOT NULL UNIQUE,
    "connected"     BOOLEAN         NOT NULL DEFAULT true,
    "socketID"      VARCHAR(255),
    "userID"        INTEGER         NOT NULL,

    CONSTRAINT "Robot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UserAccount" (
    "id"            SERIAL          NOT NULL,
    "createdAt"     TIMESTAMP(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3)    NOT NULL,
    "email"         TEXT            NOT NULL,
    "username"      TEXT            NOT NULL UNIQUE,
    "password"      TEXT            NOT NULL,
    "firstName"     VARCHAR(20)     NOT NULL,
    "lastName"      VARCHAR(20)     NOT NULL,

    CONSTRAINT "UserAccount_pkey" PRIMARY KEY ("id")
);