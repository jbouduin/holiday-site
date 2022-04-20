export class HolidayListItem {

  //#region Public properties -------------------------------------------------
  public readonly date: Date;
  public readonly key: string;
  public readonly location: string;
  public readonly name: string;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  constructor(date: Date, key: string, location: string, name: string) {
    this.date = date;
    this.key = key;
    this.location = location;
    this.name = name;
  }
  //#endregion
}
