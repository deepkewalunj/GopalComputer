import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';

export class FiscalYear{



  static getFiscalStartYearByToday(today:NgbDate){

    if(today.month<=3)
    {
      return today.year-1;
    }
    return today.year;
  }
}
