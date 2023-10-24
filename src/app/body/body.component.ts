import { Component } from '@angular/core';
import { DataService } from '../data/data.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent {

  constructor(
    private dataService: DataService
  ) { }

  tableHeads = ["Amount", "Date", "Bank", "Card details", ""]
  newObj = [
    {
      "date": "",
      "amount": "",
      "payment_info": ""
    }
  ]
  showMessage: any
  cardArray: any[] = [];
  upiArray: any[] = [];
  rtgsArray: any[] = [];
  chequeArray: any[] = [];
  ngOnInit() {
    let copynew = JSON.parse(JSON.stringify(this.newObj));
    let copynew1 = JSON.parse(JSON.stringify(this.newObj));
    let copynew2 = JSON.parse(JSON.stringify(this.newObj));
    let copynew3 = JSON.parse(JSON.stringify(this.newObj));
    this.cardArray.push(copynew)
    this.upiArray.push(copynew1)
    this.rtgsArray.push(copynew2)
    this.chequeArray.push(copynew3)
  }
  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.shiftKey && event.key === 'Enter') {
      let copynew = JSON.parse(JSON.stringify(this.newObj));
      if (index == 1) {
        this.cardArray.push(copynew)
      }
      else if (index == 2) {
        this.upiArray.push(copynew)
      }
      else if (index == 3) {
        this.rtgsArray.push(copynew)
      }
      else if (index == 4) {
        this.chequeArray.push(copynew)
      }
    }
  }
  add_new(e: any) {
    let copynew = JSON.parse(JSON.stringify(this.newObj));
    if (e == 1) {
      this.cardArray.push(copynew)
    }
    else if (e == 2) {
      this.upiArray.push(copynew)
    }
    else if (e == 3) {
      this.rtgsArray.push(copynew)
    }
    else if (e == 4) {
      this.chequeArray.push(copynew)
    }
  }
  delete_arry(i: any, e: any) {
    if (e == 1) {
      this.cardArray.splice(i, i)
    }
    else if (e == 2) {
      this.upiArray.splice(i, i)
    }
    else if (e == 3) {
      this.rtgsArray.splice(i, i)
    }
    else if (e == 4) {
      this.chequeArray.splice(i, i)
    }
  }

  formatPaymentData(mode: number, dataArray: any[]): any {
    return {
      mode,
      options: dataArray.map(item => {
        return {
          date: item.date,
          amount: item.amount,
          payment_info: item.payment_info
        };
      })
    };
  }
  submit() {
    const url = 'https://sipserver.1ounce.in/shop/task/';

    const paymentData = [
      this.formatPaymentData(1, this.upiArray),
      this.formatPaymentData(2, this.cardArray),
      this.formatPaymentData(3, this.rtgsArray),
      this.formatPaymentData(4, this.chequeArray)
    ];

    const data = {
      payment_data: JSON.stringify(paymentData)
    };

    this.dataService.postData(url, data).subscribe(
      response => {
        console.log('API Response:', response);
        this.showMessage = response.message

      },
      error => {
        console.error('Error:', error);
        this.showMessage = "something went wrong"
      }
    );
  }
}
