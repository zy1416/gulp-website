const gulp = require('gulp')
const uglify = require('gulp-uglify');//js压缩
const minifyCSS = require('gulp-minify-css'); //css压缩
const imagemin = require('gulp-imagemin');// //html压缩
const babel = require('gulp-babel')
const rev = require('gulp-rev');//- 对文件名加MD5后缀
const revCollector = require('gulp-rev-collector'); //替换html中的文件名
const clean = require('gulp-clean');//清空文件夹，避免文件冗余
const runSequence = require('run-sequence'); //执行顺序，避免
const autoprefixer = require("gulp-autoprefixer"); //增加css浏览器头
const htmlmin = require('gulp-htmlmin'); //压缩html文件
const concat = require('gulp-concat'); //文件合并
const less = require('gulp-less');//less文件编译
const connect = require('gulp-connect');//gulp 服务器



/**********************************************
 *     开发环境
 **********************************************/
const dev_less_src = './trunk/styles',
    dev_css_src = './trunk/css';

gulp.task('build-less', function () {
    return gulp.src(dev_less_src + '/**/index.less')
        .pipe(less())
        .pipe(gulp.dest(dev_css_src))
});

gulp.task('watch-less', function () {
   return gulp.watch('./trunk/styles/*.less', ['build-less']); // 注意，任务列表是个数组，即使只有一个元素。
});

gulp.task('server', function () {
    connect.server({
        root: "./trunk",
        port: 3011,
        livereload:true
    });
});


/**********************************************
 *     生产编译
 **********************************************/
const src_css = './trunk/css',
    dest_css = './dist/css',
    src_js = './trunk/js',
    dest_js = './dist/js',
    src_img = './trunk/img',
    dest_img = './dist/img',
    src_html = './trunk',
    dest_html = './dist';


gulp.task("clean", function () {
    return gulp.src('dist')
        .pipe(clean({force: true}));
})


gulp.task('build-img', function () {
    return gulp.src(src_img + '/**/*.*')
        .pipe(imagemin({progressive: true}))
        .pipe(rev())
        .pipe(gulp.dest(dest_img))
        .pipe(rev.manifest())
        //- 将 rev-manifest.json 保存到 rev 目录内
        .pipe(gulp.dest('rev/img'));
});


gulp.task('build-css', function () {
    return gulp.src(['rev/img/rev-manifest.json', src_css + '/*.css'])
        .pipe(revCollector())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(minifyCSS())
        .pipe(rev())
        .pipe(gulp.dest(dest_css))//- 生成一个rev-manifest.json
        .pipe(rev.manifest())
        //- 将 rev-manifest.json 保存到 rev 目录内
        .pipe(gulp.dest('rev/css'));
});


gulp.task('build-js', function () {
    //找到需要压缩的文件
    return gulp.src(src_js + '/**/*.js')   ////  /**/  表示js目录下的任意层级的目录
    //把ES6代码转成ES5代码
        .pipe(babel())
        /////压缩文件
        .pipe(uglify())
        //- 文件名加MD5后缀
        .pipe(rev())
        //另存压缩后文件
        .pipe(gulp.dest(dest_js))
        //- 生成一个rev-manifest.json
        .pipe(rev.manifest())
        //- 将 rev-manifest.json 保存到 rev 目录内
        .pipe(gulp.dest('rev/js'));
});


gulp.task('build-html', function () {
    return gulp.src(['rev/**/*.json', src_html + '/**/*.html']) //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector())  //- 执行文件内css,js,img名的替换
        .pipe(htmlmin({
            removeComments: true,//清除HTML注释
            collapseWhitespace: true,//压缩HTML
            collapseBooleanAttributes: false,//省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: false,//删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
            minifyJS: true,//压缩页面JS
            minifyCSS: true//压缩页面CSS
        })) //压缩html文件
        .pipe(gulp.dest(dest_html)); //- 替换后的文件输出的目录
});


let isProduction = true;
if (isProduction) {
    gulp.task('default', function () {
        runSequence(
            'clean',
            'build-less',
            "build-img",
            "build-css",
            "build-js",
            "build-html"
        );
    });
} else {
    gulp.task('default', ['build-less','watch-less','server'])
}

