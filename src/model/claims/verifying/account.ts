import { Property } from './property'

export class Account {
    public static type(): Property<string> {
        return new Property<string>('type')
    }

    public static identification(): Property<string> {
        return new Property<string>('identification')
    }
}