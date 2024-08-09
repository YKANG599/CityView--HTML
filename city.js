let objs = {
    body:null,
    inputCity: null,
    btnSearch:null,
    carousel:null,
    preUrl:null,
    btnPrev: null,
    btnNext: null,
    page:{
        cursor:1,
        total: 1,
    }
}

const unsplashKey = '-Pyb7jp_r8TSIPgHobqUq4q8EUhmijBOUSfc_7gHrlc'

// selects the <body> element of the HTML document and assigns it
// to the body property of the objs object.
objs.body = document.querySelector('body')
objs.inputCity = document.querySelector('.searchBar input')
objs.btnSearch= document.querySelector('.searchBar button')
objs.carousel= document.querySelector('.gallery')
objs.btnPrev= document.querySelector('.btnNav.prev')
objs.btnNext= document.querySelector('.btnNav.next')


const setKeyEvent = function(){
    objs.inputCity.addEventListener("keyup",function(evt){
        if(evt.key === 'Enter' && objs.inputCity.value.trim().length){
            fetchData()
        }
    })

    objs.body.addEventListener("keyup",function(evt){
        if(evt.key === 'ArrowLeft'){
            prevPage()
        }
        if(evt.key === 'ArrowRight'){
            nextPage()
        }
    })

    objs.btnPrev.addEventListener('click', prevPage)
    objs.btnNext.addEventListener('click', nextPage)
}

const prevPage = function(){
    if(objs.page.cursor >1){
        objs.page.cursor--
    }
    fetchData()
}

const nextPage = function(){
    if(objs.page.cursor  < objs.page.total){
        objs.page.cursor++
    }
    fetchData()
}

const fetchData = function(){
    const newCity =  objs.inputCity.value.trim().toLowerCase() || 'toronto'
    fetch(`https://api.unsplash.com/search/photos?client_id=${unsplashKey}&query=${newCity}&orientation=landscape&page=${objs.page.cursor}`)
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            console.log('data fetched: ',data)
            renderImage(data.results)
            objs.page.total = data.total_pages
        })
}

// Render the first image as the background and create a carousel
const renderImage = function(arrImages){
    const img = arrImages[0].urls.full
    objs.body.style.background = `url('${img}') no-repeat center center fixed`
    createCarousel(arrImages)
}

// Update the background image
const updateBackgroundImage = function(url2){
    objs.body.style.background = `url('${url2}') no-repeat center center fixed`
}

const setImageSelected = function(eleImage){
    let images = document.querySelectorAll('[data-index]')
    images.forEach(function(ele){
        ele.className = ''
    })
    eleImage.className = 'selected'
}

let isImageSelected = false

const createCarousel = function(arrImages){
    objs.carousel.innerHTML = '' // Clear the existing carousel content

    for(let i = 0; i < arrImages.length; i++){
        let item = document.createElement('div')
        item.className = 'imgContainer'

        const img = arrImages[i].urls.thumb
        item.style.background = `url('${img}') no-repeat center center fixed`

        item.dataset.index = i
        item.style.animation = 'fadeIn 0.25s forwards'
        item.style.animationDuration = `${0.1 * i}s`
        item.dataset.url = arrImages[i].urls.full
        objs.carousel.appendChild(item)

        item.addEventListener('click', function(evt){
            updateBackgroundImage(evt.target.dataset.url)
            setImageSelected(evt.target)
            isImageSelected = true // Mark that an image is selected
        })

        item.addEventListener('mouseenter', function(evt){
            if (!isImageSelected) { // Only update if no image is selected
                let newUrl = evt.target.dataset.url

                if (!objs.preUrl) {
                    let str = objs.body.style.background
                    let iStart = str.indexOf('"')
                    let iEnd = str.indexOf('"', iStart + 1)
                    str = str.slice(iStart + 1, iEnd)

                    objs.preUrl = str
                    updateBackgroundImage(newUrl)
                }
            }
        })

        item.addEventListener('mouseleave', function(evt){
            if (!isImageSelected && objs.preUrl) { // Only reset if no image is selected
                updateBackgroundImage(objs.preUrl)
                objs.preUrl = null
            }
        })
    }
}

fetchData()
setKeyEvent()
objs.btnSearch.addEventListener('click',fetchData)