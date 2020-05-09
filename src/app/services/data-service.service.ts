import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {map } from 'rxjs/operators'
import { GlobalDataSummary } from '../models/global-data';
import { DatePipe } from '@angular/common';
import { DateWiseData } from '../models/date-wise';
DatePipe
@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  constructor(private _http: HttpClient) { }
  private date=new Date();
  dte=this.date.setDate(this.date.getDate()-1)
  datePipe=new DatePipe('en-US')
  dof=this.datePipe.transform(this.dte,'MM-dd-yyyy')
   
   
private globalDataUrl="https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/"+this.dof+".csv" 
private dateWiseUrl="https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"  

getDateWiseData(){
  return this._http.get(this.dateWiseUrl,{responseType:'text'}).pipe(
    map(result=>{
      let rows=result.split('\n');
      let mainData={};
      let header=rows[0];
      let dates=header.split(/,(?=\S)/)
      dates.splice(0,4);
      rows.splice(0,1)
      rows.forEach(row=>{
        let cols=row.split(/,(?=\S)/);
        let con=cols[1];
        cols.splice(0,4);
        mainData[con]=[];
        cols.forEach((value, index)=>{
          let dw: DateWiseData={
            cases: +value,
            country: con,
            date: new Date(Date.parse(dates[index]))
          }
          mainData[con].push(dw)
         
          

        })
        
      })
      // console.log(mainData);
      return mainData
    })
    
  )
}

getGlobalData(){
    console.log(this.dof);
    return this._http.get(this.globalDataUrl,{responseType: 'text'}).pipe(
      map(result=>{
        let data : GlobalDataSummary[] = [];
        let raw=[]
        let rows=result.split('\n');
        rows.splice(0,1);
        rows.forEach(row=>{
          let cols=row.split(/,(?=\S)/);
          let cs={
            country: cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10],
          };
          let temp: GlobalDataSummary=raw[cs.country]
          if (temp){
            temp.active=cs.active + temp.active;
            temp.confirmed=cs.confirmed + temp.confirmed;
            temp.deaths = cs.deaths + temp.deaths;
            temp.recovered = cs.recovered +  temp.recovered;
            raw[cs.country]=temp;

          }
          else{
            raw[cs.country]=cs;
          }

        })
        
      return <GlobalDataSummary[]>Object.values(raw)
      }
      ))
  }
}
