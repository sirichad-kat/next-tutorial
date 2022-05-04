const importAll = (r) => {
    let images = {};
    r.keys().forEach((item, index) => {
        images[item.replace("./", "")] = r(item);
    });
    return images;
};

const iconimages = importAll(
    require.context("../public/Images/Icon", false, /\.(png|jpe?g|svg|gif)$/)
);

let Icons = {};
Icons.clone = iconimages["clone.png"].default;
Icons.close = iconimages["close.png"].default;
Icons.delete = iconimages["delete.png"].default;
Icons.new = iconimages["new.png"].default;
Icons.refresh = iconimages["refresh.png"].default;
// Icons.report = iconimages["report.png"].default;
Icons.search = iconimages["search.png"].default;
Icons.save = iconimages["save.png"].default;
Icons.savenew = iconimages["savenew.png"].default;
Icons.edit = iconimages["edit.png"].default;
Icons.filter = iconimages["filter.png"].default;
Icons.submit = iconimages["submit.png"].default;
Icons.approve = iconimages["approve.png"].default;
Icons.deny = iconimages["deny.png"].default;
Icons.confirm = iconimages["confirm.png"].default;
Icons.cancel = iconimages["reject.png"].default;
Icons.print = iconimages["print.png"].default;
Icons.refresh = iconimages["refresh.png"].default;
Icons.close = iconimages["close.png"].default;
Icons.excel = iconimages["excel.svg"].default;
Icons.same = iconimages["same.jpg"].default;
Icons.template = iconimages["excel.png"].default;
Icons.import = iconimages["import.png"].default;

export default Icons