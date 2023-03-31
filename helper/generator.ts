import { Chance } from 'chance';

type ParserReturnVal = {
    [key: string]: string | string[] | undefined;
    firstName?: string;
    lastName?: string;
    uniqueNmbr?: string;
    password?: string;
    notParsed: string[];
};
export default class Data {
    private static __instance__: Data;
    private firstName: string;
    private lastName: string;
    private uniqueNmbr: string;
    private password: string;

    /**
     * Constructor
     * @private
     */
    private constructor() {
        const fullName = this.generateFullName();
        this.firstName = fullName.firstName;
        this.lastName = fullName.lastName;
        this.uniqueNmbr = this.generateUniqueNumber();
        this.password = this.generatePassword();
    }

    public static getInstance() {
        return this.__instance__ || (this.__instance__ = new this());
    }

    /**
     * Parse data
     * @param string
     */
    featureParser(string: string) {
        const templateMatcher = /{{\s?([^{}\s]*)\s?}}/g;
        const returnVal: ParserReturnVal = { notParsed: [] };
        const parsed = string.split(' ').map((x) => {
            const filteredVersion = x.match(templateMatcher);

            if (!filteredVersion) {
                returnVal.notParsed.push(x);
                return x;
            }

            switch (filteredVersion[0]) {
                case '{{firstname}}':
                    return (returnVal.firstName = this.firstName);
                case '{{lastname}}':
                    return (returnVal.lastName = this.lastName);
                case '{{mrn}}':
                    return (returnVal.mrn = this.uniqueNmbr);
                case '{{password}}':
                    return (returnVal.password = this.password)
            }
        });

        return { values: returnVal, words: parsed };
    }

    /**
     * Fullname
     * @param gender
     */
    generateFullName(gender: 'male' | 'female' = 'male') {
        const chance = new Chance();
        const splitted = chance.name({ gender }).split(' ');
        return { firstName: splitted[0], lastName: splitted[1] };
    }

    /**
     * Unique Number
     */
    generateUniqueNumber() {
        let UNumber: string = (Math.random() * 1000).toFixed(0).padStart(6, '0');
        return UNumber;
    }

    /**
     * Generate Password
     */
    generatePassword() {
        const chance = new Chance();
        let password: string = "P?" + chance.string({ length: 8, casing: 'lower', alpha: true, numeric: true  });
        return password;
    }

    /**
     * Birthday
     * @param returnISOOrString
     * @param stringType
     * @param min
     * @param max
     */
    generateBirthDay(returnISOOrString: 'ISO' | 'string', stringType: 'american' | 'normal', min: number = 1940, max: number = 2003) {
        const chance = new Chance();
        const year = chance.year({ min, max });
        return chance.birthday({ year, american: stringType === 'american', string: returnISOOrString === 'string' });
    }

    /**
     * Phone Number
     */
    generatePhoneNumber() {
        const chance = new Chance();
        return chance.phone();
    }

    /**
     * Firstname
     */
    public getFirstName(): string {
        return this.firstName;
    }

    /**
     * Lastname
     */
    public getLastName(): string {
        return this.lastName;
    }
}
