let ServiceUrl = {};

ServiceUrl.urlAuthen = "https://smartilabauthen-dev.cpf.co.th/api/";
ServiceUrl.urlBase = "https://apigw-dev.cpf.co.th/smartlimsapi/framework/";
ServiceUrl.urlWorksheet = "https://apigw-dev.cpf.co.th/smartlimsapi/worksheet/";
ServiceUrl.InternetYn = "N";


ServiceUrl.pageSize = 15;
ServiceUrl.pageSizeLookup = 10;
ServiceUrl.timeSetNumClick = 1000; // millisecond

ServiceUrl.CriteriaType = {
  BeginWith: 0,
  IsEqual: 1,
  IsNotEqual: 2,
  LessThan: 3,
  LessThanOrEqual: 4,
  MoreThan: 5,
  MoreThanOrEqual: 6,
  Between: 7
}


export default ServiceUrl;
