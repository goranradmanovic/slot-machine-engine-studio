export class ApiResponse<T = unknown> {
    constructor(
        public success: boolean,
        public message: string,
        public data?: T
    ) {}
}