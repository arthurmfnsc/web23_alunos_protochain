export default class Validation {
    private readonly success: boolean;
    private readonly message: string;

    constructor(sucess = true, message = "") {
        this.success = sucess;
        this.message = message;
    }

    isSucess(): boolean {
        return this.success;
    }

    getMessage(): string {
        return this.message;
    }
}
