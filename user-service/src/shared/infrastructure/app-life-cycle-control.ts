/* eslint-disable */
import { Injectable } from '@nestjs/common'
import { Logger } from '../domain/logger'

export const APP_LIFECYCLE_EVENTS = {
  SIGINT: 'SIGINT',
  SIGTERM: 'SIGTERM',
  SIGQUIT: 'SIGQUIT',
  UNCAUGHT_EXCEPTION: 'uncaughtException'
} as const

interface EventHandler {
  classInstance: any
  methodName: string
  methodParams: any
}

class AppLifeCycleHandlerRegistrationError extends Error {
  constructor (message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

@Injectable()
export class AppLifeCycleControl {
  private readonly exitEventHandlers: Map<number, EventHandler> = new Map<number, EventHandler>()

  public constructor (
    private readonly logger: Logger
  ) {

    this.registerOnExitEventSubscriptions()
  }

  private registerOnExitEventSubscriptions (): void {
    process.once(APP_LIFECYCLE_EVENTS.SIGINT, async () => {
      this.logger.info(`PID ${process.pid} Received ${APP_LIFECYCLE_EVENTS.SIGINT} event`)
      await this.executeOnExitEventHandlers()
      process.exit(0)
    })
    process.once(APP_LIFECYCLE_EVENTS.SIGTERM, async () => {
      this.logger.info(`PID ${process.pid} Received ${APP_LIFECYCLE_EVENTS.SIGTERM} event`)
      await this.executeOnExitEventHandlers()
      process.exit(0)
    })
    process.once(APP_LIFECYCLE_EVENTS.SIGQUIT, async () => {
      this.logger.info(`PID ${process.pid} Received ${APP_LIFECYCLE_EVENTS.SIGQUIT} event`)
      await this.executeOnExitEventHandlers()
      process.exit(0)
    })
    process.once(APP_LIFECYCLE_EVENTS.UNCAUGHT_EXCEPTION, async (err: any) => {
      this.logger.info(`PID ${process.pid} Received ${APP_LIFECYCLE_EVENTS.UNCAUGHT_EXCEPTION} event`)
      await this.executeOnExitEventHandlers()
      this.logger.error(err)
      process.exit(1)
    })
  }

  private async executeOnExitEventHandlers (): Promise<void> {
    try {
      this.logger.debug('exit handlers execution started')
      const sortedMap = new Map([...this.exitEventHandlers].sort((a, b) => a[0] - b[0]))

      for (const [_, eventHandler] of sortedMap) {
        await eventHandler.classInstance[eventHandler.methodName](eventHandler.methodParams)
      }

      this.logger.debug('exit handlers execution completed')
    } catch (err: any) {
      this.logger.error(err)
    }
  }

  public addExitEventHandler (priority: number, classInstance: any, methodName: string, methodParams?: any): void {
    if (!this.exitEventHandlers.has(priority)) {
      this.logger.info(`registering onExit event handler: ${classInstance.constructor.name as string}.${methodName} priority ${priority}`)
      this.exitEventHandlers.set(priority, { classInstance, methodName, methodParams })
    } else {
      const error = new AppLifeCycleHandlerRegistrationError(`there is already an exit event handler registered with priority ${priority}`)
      this.logger.error(error)
      throw error
    }
  }
}
