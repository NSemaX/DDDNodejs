import { ValueObject } from "../seedwork/valueObject";

interface IAddress {
    streetAddress: string,
    city: string,
    state: string,
    zip: string,
  }
  
  interface IAddressValueObjectProps {
    value: IAddress;
  }
  
  export class Address extends ValueObject<IAddressValueObjectProps> {
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