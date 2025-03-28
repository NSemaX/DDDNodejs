export class CustomerUpdateRequest  {
    ID:number;
    Name: string;
    Surname: string;
    Email: string;
    Password: string;
    Address:AddressDTO;
    Status:number;
    }
    
    export class AddressDTO {
        StreetAddress: string;
        City: string;
        State: string;
        Zip: string;
    }

export default CustomerUpdateRequest