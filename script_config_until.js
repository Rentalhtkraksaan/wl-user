
const CWU_DB_CONFIG = {
    apiKey: "AIzaSyDpPEkKbEt6b_v2OWlBfGuaVQpBg2-RWR4", 
    authDomain: "cwu-gen-2.firebaseapp.com",
    databaseURL: "https://cwu-gen-2-default-rtdb.firebaseio.com",
    projectId: "cwu-gen-2",
    storageBucket: "cwu-gen-2.appspot.com",
    messagingSenderId: "40585612014",
    appId: "1:40585612014:web:c88141fee3699aca68181ff",
    measurementId: "G-S8D7DFJ1G3"
};

if (typeof firebase === 'undefined') {
    console.error("Firebase SDK belum dimuat.");
    throw new Error("Firebase SDK Error");
}

firebase.initializeApp(CWU_DB_CONFIG);

const CWU_REALTIME_DATABASE = firebase.database();
const THRESHOLD_WELPART = 7000; 
const THRESHOLD_KAS = 10000;    
const CURRENCY_FORMATTER = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
const CWU_DATA_TABLE_BODY = document.querySelector('#financial_cwu_table tbody');
let CWU_MASTER_DATA = []; 
let CURRENT_FILTER_DIVISION = '';
let CURRENT_SEARCH_TERM = '';
