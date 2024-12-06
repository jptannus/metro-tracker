import axios from "axios";

export default {
  getAllSites() {
    return axios.get('https://transport.integration.sl.se/v1/sites?expand=true')
    .then(res => res.data.sort((a, b) => a.name > b.name ? 1 : -1))
    .catch((error) => console.log(error))
  },
  
  getVallingbySiteInfo(){
    return getAllSites().then(sites => sites.filter((site) => site.name == 'Vällingby')[0]);
  },
  
  getAllDeparturesFromSiteID(site_id, forecast, direction) {
    return axios.get(`https://transport.integration.sl.se/v1/sites/${site_id}/departures`, {
      params: {
        transport: 'METRO',
        forecast: forecast,
        direction: direction
      }
    })
    .then(res => res.data.departures)
    .catch((error) => console.log(error))
  }
}