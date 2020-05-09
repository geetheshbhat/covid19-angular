import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DateWiseData } from 'src/app/models/date-wise';
import { merge } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';


@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
data: GlobalDataSummary[];
countries: string[] = [];
totalConfirmed=0;
  totalActive=0;
  totalDeaths=0;
  totalRecovered=0;
  loading=true
  selectedCountryData: DateWiseData[];
  dateWiseData;
  options: {
    height: 500,
    animation: {
      duration: 1500,
      easing: 'linear',
      startup: true
    }
  }
  

  constructor(private _dataService: DataServiceService) { }

  ngOnInit(): void {

    merge(
      this._dataService.getDateWiseData().pipe(
        map(result=>{
          this.dateWiseData=result
        })
      ),
      this._dataService.getGlobalData().pipe(
        map(result=>{
          this.data=result;
      this.data.forEach(cs=>{
        this.countries.push(cs.country)
      })
        })
      )
    ).subscribe(
      {
        complete:()=>{
          this.selectedCountryData=this.dateWiseData['India']
          this.updateChart();
          this.loading=false

        }
      }
    )

    
  }
  updateValue(country: string){
    console.log(country);
    this.data.forEach(cs=>{
      if(cs.country==country){
        this.totalActive=cs.active;
        this.totalConfirmed=cs.confirmed;
        this.totalDeaths=cs.deaths;
        this.totalRecovered=cs.recovered
      }
    })
   this.selectedCountryData= this.dateWiseData[country]
   this.updateChart();
  }

  updateChart(){
    let datatable=[];
    datatable.push(['date','cases'])
    this.selectedCountryData.forEach(cs => {
      datatable.push([cs.date,cs.cases])
    });
    
   
     
   


  }
}
