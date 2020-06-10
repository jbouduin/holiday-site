export class HolidayListItem {

  // <editor-fold desc='Public properties'>
  public date: Date;
  public key: string;
  public location: string;
  public name: string;
  // </editor-fold>

  // <editor-fold desc='Constructor & C°'>
  constructor(date: Date, key: string, location: string, name: string) {
    this.date = date;
    this.key = key;
    this.location = location;
    this.name = name;
  }
  // </editor-fold>
}
