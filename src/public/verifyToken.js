fetch("/api/auth/check", { method: "GET" })
  .then((res) => {
    if (res.status !== 200) {
      window.location.href = "index.html";
    }
  })
  .catch((error) => console.log(error));