export enum EnumStepStatus {
    PENDING,         // The step has not been resolved yet
    RESOLVED,        // The step has been resolved but not started yet
    PROCESSING,      // The step is currently being processed
    ENDED            // The step has ended
};