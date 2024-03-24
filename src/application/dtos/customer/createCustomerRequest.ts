export class CreateCustomerRequest  {
    Name: string;
    Surname: string;
    Email: string;
    Password: string;
    Address:AddressDTO;
    }
    export class AddressDTO {
        StreetAddress: string;
        City: string;
        State: string;
        Zip: string;
    }

export default CreateCustomerRequest