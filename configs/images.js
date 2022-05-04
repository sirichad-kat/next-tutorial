const importAll = (r) => {
   let images = {};
   r.keys().forEach((item) => {
      images[item.replace("./", "")] = r(item);
   });
   return images;
};

const loginimages = importAll(require.context("../public/Images/Login", false, /\.(png|jpe?g|svg)$/));

const contentimages = importAll(require.context("../public/Images/Content", false, /\.(png|jpe?g|svg|gif)$/));

let Images = {};
Images.login_wave = loginimages["wave4.png"].default;
Images.login_avatar = loginimages["avatar.svg"].default;
Images.login_cover = loginimages["Laboratory_icon.png"].default;

Images.logo = contentimages["labicon.png"].default;
Images.loading = contentimages["loading.gif"].default;

export default Images;
