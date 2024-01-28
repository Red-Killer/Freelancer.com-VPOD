function call(data) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, data, function (resp) {
        resolve(resp);
      });
    });
  });
}

function getUserInfo(Id) {
  return new Promise((resolve, reject) => {
    fetch(
      `https://www.freelancer.com/api/users/0.1/users?country_details=true&users[]=${Id}`
    )
      .then((response) => response.json())
      .then((data) => {
        resolve(data.result.users[Id]);
      });
  });
}

function getProjectInfo(Id) {
  return new Promise((resolve, reject) => {
    fetch(
      `https://www.freelancer.com/api/projects/0.1/projects?projects[]=${Id}&job_details=true`
    )
      .then((response) => response.json())
      .then((data) => {
        resolve(data.result.projects[0]);
      });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // get page url
  chrome.tabs.query(
    { active: true, currentWindow: true },
    async function (tabs) {
      const url = tabs[0].url;
      if (url == null) {
        document.querySelector(".app").classList.add("hidden");
        return;
      }
      if (url.match(/freelancer\.com\/projects\/.*\/.*\/details/)) {
        document.querySelector(".no-app").classList.add("hidden");
        const proj = await getProjectInfo(await call({ type: "getProjectId" }));
        if (proj == null) {
          return;
        }
        const owner = await getUserInfo(proj.owner_id);

        // set class username, display-name, public-name
        document.querySelector(".username").innerHTML = owner.username;
        document.querySelector(".public-name").innerHTML = owner.public_name;

        const profile_url = `https://www.freelancer.com/u/${owner.username}`;
        document.querySelector(".view-profile").onclick = function () {
          chrome.tabs.create({ url: profile_url });
        };
      } else {
        document.querySelector(".app").classList.add("hidden");
      }
    }
  );
});
