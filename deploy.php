<?php

namespace Deployer;

require 'recipe/common.php';

include 'deploy.config.php';

set('application', 'JVSHOOT');
set('repository', 'https://github.com/4sucres/jvshoot.git');
set('git_tty', false);

task('facebook:zip', function () {
    // run('cordova build android');
    run('7z.exe a jvshoot_facebook.zip www\.\*');
    run('7z.exe d jvshoot_facebook.zip index.html cordova.html');
    run('7z.exe rn jvshoot_facebook.zip facebook.html index.html');
    run('mv jvshoot_facebook.zip platforms');
})->local();

task('android:build', function () {
    run('cordova build android');
})->local();

task('upload:apk', function () {
    upload("./platforms/android/app/build/outputs/apk/debug/app-debug.apk", '{{release_path}}/www');
});

// recipe/npm.php

set('bin/npm', function () {
    return run('which npm');
});

desc('Install node packages');
task('npm:install', function () {
    run("cd {{release_path}} && {{bin/npm}} install");
});

desc('Build assets');
task('npm:build', function () {
    run("cd {{release_path}} && {{bin/npm}} run build");
});

// Tasks
desc('Deploy your project');
task('deploy', [
    'deploy:info',
    'deploy:prepare',
    'deploy:lock',
    'deploy:release',
    'deploy:update_code',
    'npm:install',
    'npm:build',
    'deploy:clear_paths',
    'deploy:symlink',
    'deploy:unlock',
    'cleanup',
    'success'
]);

after('deploy:failed', 'deploy:unlock');

desc('Deploy apk');
task('deploy:apk', [
    'npm:build',
    'android:build',
    'upload:apk',
    'success'
]);
