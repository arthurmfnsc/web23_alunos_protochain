export default class Validation {
    private success: boolean;
    private message: string;

    constructor(sucess: boolean = true, message: string = "") {
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
