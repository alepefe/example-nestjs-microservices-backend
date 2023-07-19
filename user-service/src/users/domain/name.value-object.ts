import { InvalidArgumentError } from '../../shared/domain/invalid-argument.error';
import { StringValueObject } from '../../shared/domain/value-objects/string.value-object';

export class Name extends StringValueObject {

    constructor(value: string) {
        super(value);
        this.ensureValueIsValid(value);
    }

    private ensureValueIsValid(value: string) {
        if(value == null || value === '') throw new InvalidArgumentError('the name cannot be empty');
    }

}
