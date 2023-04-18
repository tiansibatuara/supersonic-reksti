// HTML Ref
const statusEl = document.getElementById('status')
const table = document.getElementById('table')
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
const bookForm = document.getElementById('book-form');
const bookButton = document.getElementById('book-button')

// Global var
const now = new Date();
const hours = now.getHours();
const minutes = now.getMinutes();
let currStatus = 0;
let currSelected = -1;
let bookedData = []
const localData = localStorage.getItem('booking')
const initData = [
    {
        "id": 0,
        "booked": false,
        "name": null,
        "email": null
    },
    {
        "id": 1,
        "booked": false,
        "name": null,
        "email": null
    },
    {
        "id": 2,
        "booked": false,
        "name": null,
        "email": null
    },
    {
        "id": 3,
        "booked": false,
        "name": null,
        "email": null
    },
    {
        "id": 4,
        "booked": false,
        "name": null,
        "email": null
    },
    {
        "id": 5,
        "booked": false,
        "name": null,
        "email": null
    },
    {
        "id": 6,
        "booked": false,
        "name": null,
        "email": null
    },
    {
        "id": 7,
        "booked": false,
        "name": null,
        "email": null
    }
]

// If want to resed data, uncomment this function
// reloadData()

if(localData){
    const parsedData = JSON.parse(localData)
    if (parsedData.length > 0){
        if (hours === 0 && minutes === 0){
            localStorage.setItem('booking', JSON.stringify(initData));
        } else {
            bookedData = parsedData
        }
    } else {
        bookedData = initData
    }
} else {
    bookedData = initData
}

function loadData(){
    bookedData.map((item) => {
        if(item.booked){
         const availableEl = document.getElementById('sched-' + item.id);
         availableEl.classList.remove('selected')
         availableEl.classList.add('unavailable')
        } 
     })
}

function reloadData(){
    localStorage.setItem('booking', JSON.stringify(initData));
}



loadData()

for (let i = 0; i <= 7; i++){
    if(hours >= 10 + (i * 2)){
       const availableEl = document.getElementById('sched-' + i);
       availableEl.classList.remove('selected')
       availableEl.classList.add('unavailable')
    }
}


const firebaseConfig = {
    apiKey: "AIzaSyCUCv7QBnzOQKdlGHlgmGFFVDv84wvsRPY",
    authDomain: "ultrasonic-restaurant.firebaseapp.com",
    databaseURL: "https://ultrasonic-restaurant-default-rtdb.firebaseio.com",
    projectId: "ultrasonic-restaurant",
    storageBucket: "ultrasonic-restaurant.appspot.com",
    messagingSenderId: "874568105384",
    appId: "1:874568105384:web:59e533e6b904d6d4e8719d"
};
firebase.initializeApp(firebaseConfig);        

const ref = firebase.database().ref("ultrasonic-restaurant/status")

ref.once("value", function(snapshot){
    var data = snapshot.val();
    console.log(data);
    if (data === 0) {
        statusEl.innerHTML = 'Status: 1'
        table.style.background = '#499a49'
        currStatus = 1;
    }
    else {
        statusEl.innerHTML = 'Status: 0'
        table.style.background = '#f94d44'
        currStatus = 0;
    }
})

ref.on("value", function(snapshot){
    var data = snapshot.val();
    console.log(data);
    if (data === 0) {
        statusEl.innerHTML = 'Status: 1'
        table.style.background = '#499a49'
        currStatus = 1;
    }
    else {
        statusEl.innerHTML = 'Status: 0'
        table.style.background = '#f94d44'
        currStatus = 0;
    }
})



table.onclick = function() {
    if (currStatus === 1) modal.style.display = "block";
  }
  
  span.onclick = function() {
    modal.style.display = "none";
  }
  
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
    if (event.target.id.includes('sched-')){
        const id = event.target.id.replace('sched-', '')
        if (currSelected != -1){
            const currSelectedEl = document.getElementById('sched-' + currSelected);
            currSelectedEl.classList.remove('selected')
        }
        const sched = document.getElementById(event.target.id)
        if (sched.classList.contains('unavailable')) return
        sched.classList.add('selected')
        currSelected = parseInt(id)
    }
  }

  bookForm.onsubmit = function(e) {
    e.preventDefault()


    if (currSelected == -1){
        alert('Silahkah pilih jadwal terlebih dahulu.')
        return
    }

    const schedule = document.getElementById('sched-' + currSelected).innerHTML

    emailjs.init("EwjAsLvVyFFSW1PL-")

    const templateParams = {
        name: bookForm.name.value,
        email: bookForm.email.value,
        message: `Your confirmation for ${schedule} is confirmed`
    };

    emailjs.send('service_tjidz65', 'template_pres1q6', templateParams)
        .then(function(response) {
            const data = []
            bookedData.map((item) => {
                if(item.id === currSelected){
                    const newItem = {
                        id: item.id,
                        booked: true,
                        name: bookForm.name.value,
                        email: bookForm.email.value
                    }
                    data.push(newItem)
                } else {
                    data.push(item)
                }
            })
            localStorage.setItem('booking', JSON.stringify(data));
            alert('Berhasil memesan')
            modal.style.display = "none";
            this.loadData();
            location.reload();
        }, function(error) {
           alert('Gagal memesan')
        });

  }
