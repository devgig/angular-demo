import { Component, OnInit, OnDestroy } from '@angular/core';
import { RentalService } from '../shared/rental.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { Rental } from '../module/rental.model';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.sass']
})

export class RentalComponent implements OnInit, OnDestroy {
  protected listMake: Rental[];
  protected listModel: Rental[];
  protected listYear: Rental[];

  private subInit: Subscription;
  private subModel: Subscription;
  private subYear: Subscription;
  constructor(private service: RentalService) { }

  ngOnDestroy() {
    this.subInit.unsubscribe();
    this.subModel.unsubscribe();
    this.subYear.unsubscribe();
  }

  ngOnInit() {
    this.subInit =  this.service.getRentals()
     .subscribe(res => { this.listMake = res as Rental[]; });
  }

  bindModel(make: string) {
    this.subModel = this.service.getRentalByMake(make)
    .subscribe(res => { this.listModel = res as Rental[]; });
  }

  bindYear(model: string) {
    this.subYear = this.service.getRentalByModel(model)
    .subscribe(res => {this.listYear  = res as Rental[]; });
  }




}
