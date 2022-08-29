let elForm = document.querySelector(".form_imput")
let elSearchInput = document.querySelector(".search_input")
let elBooksResult = document.querySelector(".result_number")
let elBooksWrapper = document.querySelector(".books_wrapper")
let elBookMarksWrapper = document.querySelector(".bookmark_wrapper_list")
let elBooksTemplate = document.querySelector("#books_template").content
let elBookmarksTemplate = document.querySelector("#bookmark_template").content
let elOrderBtn = document.querySelector(".order_btn")
let localSaved = JSON.parse(localStorage.getItem("saved"))
let elDarkMode = document.querySelector(".dark_mode")


elForm.addEventListener("submit", function(evt) {
    evt.preventDefault();
    
    let bookValue = elSearchInput.value.trim()
    
    if (bookValue.length > 1) {
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookValue}`, {
        method: "GET", })
        .then(ren => ren.json())
        .then(data => { 
            renderBooks(data.items)
            elBooksResult.textContent = data.totalItems
        })
    }
})


elOrderBtn.addEventListener("click" , function() {
    let bookValue = elSearchInput.value.trim()
    
    if (bookValue.length > 1) {
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookValue}&orderBy=newest`, )
        .then(ren => ren.json())
        .then(data => { 
            renderBooks(data.items)
        })
    }
})


function renderBooks(array) {
    
    elBooksWrapper.innerHTML = null
    
    let fragment = document.createDocumentFragment()
    
    for (const item of array) {
        
        let template = elBooksTemplate.cloneNode(true)
        
        template.querySelector(".book_img_temp").src = item.volumeInfo.imageLinks.thumbnail
        template.querySelector(".book_title_temp").textContent = item.volumeInfo.title
        template.querySelector(".book_author_temp").textContent = item.volumeInfo.authors
        template.querySelector(".book_year_temp").textContent = item.volumeInfo.publishedDate
        template.querySelector(".bookmark_btn_temp").dataset.bookmarkId = item.id
        template.querySelector(".moreinfo_btn_temp").dataset.infoId = item.id
        template.querySelector(".readmore_btn_temp").href = item.volumeInfo.previewLink
        template.querySelector(".readmore_btn_temp").dataset.readId = item.id
        
        fragment.appendChild(template)
    }
    
    elBooksWrapper.appendChild(fragment)
}


function renderBookmarks(array) {
    
    let fragment = document.createDocumentFragment()
    
    for (const item of array) {
        
        let template = elBookmarksTemplate.cloneNode(true)
        
        template.querySelector(".bookmarks_title").textContent = item.volumeInfo.title
        template.querySelector(".bookmarks_author").textContent = item.volumeInfo.authors
        template.querySelector(".saved_books_edit_btn").href = item.volumeInfo.previewLink
        template.querySelector(".bookmarks_delete").dataset.deleteId = item.id
        template.querySelector(".saved_bookmarks").classList.add(`del${item.id}`)
        template.querySelector(".bookmarks_del_img").dataset.deleteId = item.id
        
        fragment.appendChild(template)
    }
    
    elBookMarksWrapper.appendChild(fragment)
}


elBooksWrapper.addEventListener("click" , function(evt) {
    let current = evt.target.dataset 
    
    if (current.infoId) {
        
        fetch(`https://www.googleapis.com/books/v1/volumes/${current.infoId}`)
        .then(req => req.json())
        .then(data => renderModal(data))
        
        function renderModal(array) {
            
            document.querySelector(".modal_title").textContent = array.volumeInfo.title
            document.querySelector(".modal__img").src = array.volumeInfo.imageLinks.thumbnail
            document.querySelector(".modal__info").textContent = array.volumeInfo.description
            
            
            let wrapperAuthor = document.querySelector(".author")
            
            wrapperAuthor.innerHTML = null
            
            let newSpanauthor = document.createElement("span")
            
            newSpanauthor.classList.add("modal__bottom_atr")
            newSpanauthor.textContent = array.volumeInfo.authors[i]
            wrapperAuthor.appendChild(newSpanauthor)
            
            
            let wrapperYear = document.querySelector(".year")
            
            wrapperYear.innerHTML = null
            
            let newSpanYear = document.createElement("span")
            
            newSpanYear.classList.add("modal__bottom_atr")
            newSpanYear.textContent = array.volumeInfo.publishedDate.split("-")[0]
            wrapperYear.appendChild(newSpanYear)
            
            
            let wrapperPublisher = document.querySelector(".publisher")
            
            wrapperPublisher.innerHTML = null
            
            let newSpanPublisher = document.createElement("span")
            
            newSpanPublisher.classList.add("modal__bottom_atr")
            newSpanPublisher.textContent = array.volumeInfo.publisher.split("-")[0]
            wrapperPublisher.appendChild(newSpanPublisher)
            
            
            let wrapperCategories = document.querySelector(".catergories")
            
            wrapperCategories.innerHTML = null
            
            let newSpanCategory = document.createElement("span")
            
            newSpanCategory.classList.add("modal__bottom_atr")
            newSpanCategory.textContent = array.volumeInfo.categories[0].split("/")[i]
            wrapperCategories.appendChild(newSpanCategory)
            
            
            let wrapperPage = document.querySelector(".page")
            
            wrapperPage.innerHTML = null
            
            let newSpanPage = document.createElement("span")
            
            newSpanPage.classList.add("modal__bottom_atr")
            newSpanPage.textContent = array.volumeInfo.pageCount
            wrapperPage.appendChild(newSpanPage)
            
            let elReadBtn = document.querySelector(".modal__read_btn")
            
            elReadBtn.href = array.volumeInfo.previewLink
        }
    }
    
    
    
    if (current.bookmarkId) {
        fetch(`https://www.googleapis.com/books/v1/volumes/${current.bookmarkId}`)
        .then(req => req.json())
        .then(data => {
            let isTrue = saved.find(function(item) {
                return item.id == current.bookmarkId
            })
            
            if (!isTrue) {
                saved.push(data)
                renderBookmarks(saved)
                localStorage.setItem("saved" , JSON.stringify(saved))
            }
        })
    }
})

let saved = []

if (localSaved) {
    saved = localSaved
    renderBookmarks(saved)
}else{
    saved = []
}


elBookMarksWrapper.addEventListener("click" , function (evt) {
    let current = evt.target.dataset.deleteId

    if (current) {
        let elDelete = document.querySelector(`.del${current}`)
        elDelete.remove()
        let index = saved.indexOf(
            saved.find(function(item) {
                return item.id == current
            }))
            saved.splice(index, 1)
            localStorage.setItem("saved" , JSON.stringify(saved))
        }
    })
    
    elDarkMode.addEventListener("click" , function () {
        let body = document.querySelector(".main__body")
        body.classList.toggle("active")
    })