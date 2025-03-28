export interface IEntity {
  ID?: number;
}
export abstract class Entity<TInitProps>
 {
    public readonly ID: number;
  
    constructor(ID?: number) {
      this.ID = ID || 0;
    }
  } 