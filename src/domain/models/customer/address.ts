import { ValueObject } from "../../seedwork/valueObject";


interface IAddress {
    StreetAddress: string,
    City: string,
    State: string,
    Zip: string,
  }
  
  interface IAddressValueObjectProps {
    value: IAddress;
  }
  
  export class Address extends ValueObject<IAddressValueObjectProps> {
      StreetAddress: string;
      City: string;
      State: string;
      Zip: string;
    private constructor(props: IAddressValueObjectProps) {
      super(props);
    }
  
    get value(): IAddress {
      return this.props.value;
    }
  
    public static create(props: IAddress) {
      return new Address({ value: props });
    }
  }