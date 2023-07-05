class RobotApiModel {
    constructor(prisma) {
        this.prisma = prisma
    }

     async GetAllRobots() {
        try {
            const robots = await this.prisma.Robot.findMany()
            if (!robots) {
                console.log(`No Robots yet found`)
                return null
            }
            return robots
        } catch (err) {
            console.log(`[Model-Handling-Error]: Failed to get all robots`)
            console.log(`Error: ${err.message}`)
            throw new Error(`Failed to get all robots`)
        }
    }

     async GetRobotByID(robotID) {
        try {
            const robot = await this.prisma.Robot.findUnique({
                where: { id: robotID }
            })
            if (!robot) {
                console.log(`No Such Robot found`)
                return null
            }
            return robot
        } catch (err) {
            console.log(`Error: ${err.message}`)
            throw new Error(`[Model-Handling-Error]: Failed to get robot entity with robot-id`)
        }
    }

    async GetRobotByAddress(robotAddress) {
        try {
          const robot = await this.prisma.Robot.findFirst({
            where: { robotAddress: robotAddress }
          });
          if (!robot) {
            console.log(`No such robot found`);
            return null;
          }
          return robot;
        } catch (err) {
          console.log(`Error: ${err.message}`);
          throw new Error(`[Model-Handling-Error]: Failed to get robot entity with robot-address`);
        }
      }
      

     async GetUserRobots(userID) {
        try {
            const robots = await this.prisma.Robot.findMany({
                where: { userID: userID }
            })
            if (!robots) {
                console.log(`No Robots belongs to this user`)
                return null
            }
            return robots
        } catch (err) {
            console.log(`Error: ${err.message}`)
            throw new Error(`[Model-Handling-Error]: Failed to get robot entities with user-id`)
        }
    }

     async GetAllConnectedRobots() {
        try {
            const robots = await this.prisma.Robot.findMany({
                where: { connected: true }
            })
            if (!robots) {
                console.log(`No Current Active Robots`)
                return null
            }
            return robots
        } catch (err) {
            console.log(`Error: ${err.message}`)
            throw new Error(`[Model-Handling-Error]: Failed to get connected robot entities`)
        }
    }

     async GetUserConnectedRobots(userID) {
        try {
            const robot = await this.prisma.Robot.findMany({
                where: { userID: userID, connected: true }
            })
            if (!robot) {
                console.log(`No Active Robots currently belongs to this user`)
                return null
            }
            return robot
        } catch (err) {
            console.log(`Error: ${err.message}`)
            throw new Error(`[Model-Handling-Error]: Failed to get connected robot entities with user-id`)
        }
    }

    async DeleteRobot(robotID) {
        try {
            const robot = await this.GetRobotByID(robotID)
            if (!robot) {
                console.log(`Robot not found`)
                return 'Failed'
            }
            await this.prisma.Robot.delete({
                where: {id: robotID}
            })
            return 'Deleted'
        } catch (err) {
            console.log(`[Model-Handling-Error]: Failed to delete robot`)
            console.log(`Error: ${err.message}`)
            throw new Error(`Failed to delete robot`)
        }
    }
}

module.exports = RobotApiModel
