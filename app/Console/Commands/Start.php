<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Symfony\Component\Process\Process;

class Start extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:start';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Generating Ziggy routes...");
        Artisan::call('ziggy:generate');
        $this->line(Artisan::output());
        $this->info("Starting Laravel development server...");
        $process = new Process(['php', 'artisan', 'serve']);
        $process->setTty(Process::isTtySupported());
        $process->run();
    }
}
