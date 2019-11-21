<?php

namespace Deployer;

host('onche.party')
    ->user('skeno')
    ->set('deploy_path', '/home/skeno/workspace/jvshoot')
    ->multiplexing(false);
