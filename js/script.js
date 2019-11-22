
var bookDataFromLocalStorage = [];


$(function () {
    loadBookData();
    var data = [
        { text: "資料庫", value: "database" },
        { text: "網際網路", value: "internet" },
        { text: "應用系統整合", value: "system" },
        { text: "家庭保健", value: "home" },
        { text: "語言", value: "language" }
    ]
    $("#book_category").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: data,
        index: 0,
        change: onCategoryChange
    });
    $("#bought_datepicker").kendoDatePicker({
        value: new Date(),
        min: "1900-01-01",
        max: new Date(),
        dateInput: true,
        format: "yyyy-MM-dd"
    });

    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,
            schema: {
                model: {
                    fields: {
                        BookId: { type: "int" },
                        BookName: { type: "string" },
                        BookCategory: { type: "string" },
                        BookAuthor: { type: "string" },
                        BookBoughtDate: { type: "string" }
                    }
                }
            },
            pageSize: 20,
        },
        toolbar: kendo.template("<div class='book-grid-toolbar'><input class='book-grid-search' id='book-grid-search' placeholder='我想要找......' type='text'></input></div>"),
        height: 550,
        sortable: true,
        pageable: {
            input: true,
            numeric: false
        },
        columns: [
            { field: "BookId", title: "書籍編號", width: "10%" },
            { field: "BookName", title: "書籍名稱", width: "50%" },
            { field: "BookCategory", title: "書籍種類", width: "10%" },
            { field: "BookAuthor", title: "作者", width: "15%" },
            { field: "BookBoughtDate", title: "購買日期", width: "15%" },
            { command: { text: "刪除", click: deleteBook }, title: " ", width: "120px" }
        ]

    });
    //新增書籍的kendoWindow
    $("#window").kendoWindow({
        width: "600px",
        pageSize: "auto",
        title: "新增書籍",
        visible: false,
        modal: true,
        actions: [
            "Pin",
            "Minimize",
            "Maximize",
            "Close"
        ],
        close: onWindowClose
    }).data("kendoWindow").center();

    //點擊按鈕，打開Window
    $("#windowBtn").click(function () {
        $("#window").data("kendoWindow").open();
    })

    //新增書籍
    $("#insertBtn").click(function () {
        var validator = $("#addBookForm").kendoValidator().data("kendoValidator");
        if (validator.validate()) {
            var BookData = {
                BookId: findmaxBookId(),
                BookName: $("#book_name").val(),
                BookCategory: $("#book_category").data("kendoDropDownList").text(),
                BookAuthor: $("#book_author").val(),
                BookBoughtDate: kendo.toString($("#bought_datepicker").data("kendoDatePicker").value(), "yyyy-MM-dd")
            }

            if (BookData.BookBoughtDate == null) {
                BookData.BookBoughtDate = '1900-01-01';
            }
            var check = confirm("你確定要新增嗎?" + JSON.stringify(BookData, null, '\t')
                .replace('"BookId"', '書籍編號')
                .replace('"BookName"', '書籍名稱')
                .replace('"BookCategory"', '書籍種類')
                .replace('"BookAuthor"', '書籍作者')
                .replace('"BookBoughtDate"', '購買日期'));

            if (check) {
                $("#book_grid").data("kendoGrid").dataSource.add(BookData);
                bookDataFromLocalStorage.push(BookData);
                localStorage.setItem("bookData", JSON.stringify(bookDataFromLocalStorage));
                alert("新增成功");
              
            }
            $("#book_name").val("");
            $("#book_author").val("");
            $("#bought_datepicker").data("kendoDatePicker").value();            
        }

    });
    //搜尋書籍或作者
    $("#book-grid-search").on("input", function () {
        var inputText = $(this).val();
        $("#book-grid-search").filter(function () {
            $("#book_grid").data("kendoGrid").dataSource.filter({
                logic: "or",
                filters: [
                    { field: "BookName", operator: "contains", value: inputText },
                    { field: "BookAuthor", operator: "contains", value: inputText }
                ]

            })
        })
    })

})

function loadBookData() {
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem("bookData"));
    if (bookDataFromLocalStorage == null) {
        bookDataFromLocalStorage = bookData;
        localStorage.setItem("bookData", JSON.stringify(bookDataFromLocalStorage));
    }
}
//選擇圖書類別圖片會跟著切換
function onCategoryChange() {
    $("#book-image").attr("src", "image/" + $("#book_category").data("kendoDropDownList").value() + ".jpg");
}
//關掉window，清空欄位值
function onWindowClose() {
    $("#book_name").val("");
    $("#book_author").val("");
    $("#bought_datepicker").data("kendoDatePicker").value();
}
//刪除書籍功能
function deleteBook(event) {
    var grid = $("#book_grid").data("kendoGrid");
    var row = grid.dataItem(event.target.closest("tr"));
    var check = confirm("你確定要刪除這本書嗎?" + JSON.stringify(row, null, '\t')
        .replace('"BookId"', '書籍編號')
        .replace('"BookName"', '書籍名稱')
        .replace('"BookCategory"', '書籍種類')
        .replace('"BookAuthor"', '書籍作者')
        .replace('"BookBoughtDate"', '購買日期')
        .replace('"BookPublisher"', '出版商')
    );
    if (check) {
        //刪除grid上的row
        grid.dataSource.remove(row);

        //刪除localstorage的資料
        for (x in bookDataFromLocalStorage) {
            if (bookDataFromLocalStorage[x].BookId == row.BookId) {
                //x=start number
                bookDataFromLocalStorage.splice(x, 1);
                //重新載入
                localStorage.setItem("bookData", JSON.stringify(bookDataFromLocalStorage));
                break;
            }
        }
    }

}


//找最大的bookId，再加一
function findmaxBookId() {
    var maxBookId = 0;
    for (var x in bookDataFromLocalStorage) {
        maxBookId = bookDataFromLocalStorage[x].BookId > maxBookId ? maxBookId = bookDataFromLocalStorage[x].BookId : maxBookId;
    }
    return ++maxBookId;
}




