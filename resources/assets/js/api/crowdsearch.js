//! add all api endpoints
// ? List of Search Engine
// ? List  Campaign Groups
// ? Lists Of Campaign
// ? Create Campaign
// ? Create Multiple Campaigns
// ? Create Direct Traffic Campaign
// ? Turn On Smart Rank For a Campaign
// ? Turn Off Smart Rank For a Campaign
// ? Activate Campaign
// ? De-Activate Campaign
// ? Get List Of Activiy of a Campaign Last 10
// ? Delete Campaign
// ? Get Credit Spent for the User
// ? Get Credit Spent data for a campaign
// ? Register Account ,API to get campaign credit data of a campaign.
// ? Login , API to get campaign credit data of a campaign
// ? Login With Facebook
// ? Delete Campaign Group
// ?  Get All Settings
// ? List of Geo Countries
// ?  List of Geo States
// ? List of Geo Cities
// ? Get All Notification
// ? Move Campaign to A Group
//! A New Group Created Will Have 2 Group Created , First Level Would Be The Email of User in our DB, Next is the Group Name They Type on Input
// ? Create Keyword Finder Campaign
// ? Create PBN Link Campaign
// ? Edit Campaign (Single, Multiple & Keyword Finder Campaign)
// ? Edit PBN Link Campaign
// ? Get Result From Semrush API
// ? Get Result By Keyword Finder ID
getSearchEngine() {
    axios.get('http://crowdsearch.me/api/v1/search-engines?api_key=ffe549fff455f702e134b314fae15d97')
}