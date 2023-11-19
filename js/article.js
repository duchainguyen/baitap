import { client } from "./client.js";
import { config } from "./config.js";
const root = document.querySelector("#root");
const btnClick = document.querySelector(".btn-clickLogin");

const { PAGE_LIMIT } = config;
const rootBlogs = document.querySelector("#rootBlog"); // Add # before rootBlog

// btnClick.style.display = "none";
const app = {
  query: {}, // Define this.query

  render: function (blogs) {
    const btnHtml = `  <div class="box">  <h3>Bài viết tổng hợp</h3>
      <button class="btn-clickLogin">login</button></div>
        `;
    const html = blogs.map(({ userId, title, content, createdAt, timeUp }) => {
      // Gọi hàm timeDate để xử lý thời gian
      const formatTime = this.timeDate(createdAt);
      const timeupblogs = this.timeup(timeUp);
      return `
         <div class="container">
       
        <div class="article skeleton">
          <div class="Author skeleton ">
            <div class="avatar skeleton">
              <img class="imgavt" src="https://picsum.photos/200/200" alt="" />
            </div>
            <div class="name-time">
              <span class="name skeleton"><i class="fa-regular fa-user"></i> ${userId.name}</span>
              <span class="time skeleton"><i class="fa-solid fa-earth-americas"></i> ${formatTime}</span>
              <span class="time skeleton"><i class="fas fa-clock"></i> ${timeupblogs}</span>
            </div>
          </div>
          <div class="info">
            <div class="title">
              <h4 class="skeleton">${title}</h4>
            </div>
            <div class="content">
              <p class="skeleton">
                ${content}
              </p>
            </div>
          </div>
          <div class="action">
            <div class="like skeleton" id="like-button"><i class="fa-regular fa-thumbs-up"></i>Thích</div>
            <div class="comment skeleton"><i class="fa-regular fa-comment"></i>Bình Luận</div>
            <div class="share skeleton"><i class="fa-regular fa-share-from-square"></i>Chia sẻ</div>
          </div>
        </div>
      </div>
    `;
    });
    // console.log("lolo", blogs.createdAt);
    rootBlogs.innerHTML = btnHtml + html.join("");
    // console.log(rootBlogs);
  },

  getBlogs: async function (query = {}) {
    let queryString = new URLSearchParams(query).toString();
    if (queryString) {
      queryString = "?" + queryString;
    }
    const { data: blogs } = await client.get("/blogs" + queryString);
    this.blogs = blogs.data;
    console.log("blogs", blogs);
    this.render(blogs.data);
  },
  addEvent: function () {
    rootBlogs.addEventListener("click", function (e) {
      if (e.target.classList.contains("btn-clickLogin")) {
        e.preventDefault();
        root.style.display = "block";
        rootBlogs.style.display = "none";
      }
    });
  },
  timeup: function (timeUp) {
    let dateup = new Date(timeUp);
    let hours = String(dateup.getHours()).padStart(2, "0");
    let minutes = String(dateup.getMinutes()).padStart(2, "0");
    let seconds = String(dateup.getSeconds()).padStart(2, "0");

    // Định dạng lại giờ, phút và giây thành chuỗi
    let timeString = `${hours}:${minutes}:${seconds}`;
    return `Đăng lúc: ${timeString}`;
  },
  timeDate: function (createdAt) {
    let now = Date.now();
    let posted = new Date(createdAt).getTime();
    let diff = Math.floor((now - posted) / 1000);

    if (diff < 60) {
      return "Vừa xong";
    } else if (diff < 3600) {
      let minutes = Math.floor(diff / 60);
      return `${minutes} phút trước`;
    } else if (diff < 86400) {
      let hours = Math.floor(diff / 3600);
      return `${hours} giờ trước`;
    } else if (diff < 2592000) {
      let days = Math.floor(diff / 86400);
      return `${days} ngày trước`;
    } else {
      let date = new Date(posted);
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      return `Ngày ${day} tháng ${month} năm ${year}`;
    }
  },

  start: function () {
    this.query = {
      // Assign this.query
      _sort: "id",
      _order: "desc",
      _limit: PAGE_LIMIT,
      _page: this.currentPage, // Ensure currentPage is defined
    };

    this.getBlogs(this.query);
    this.addEvent();
  },
};

app.start();
