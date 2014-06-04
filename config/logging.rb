
Logging::Rails.configure do |config|
  require "#{Rails.root}/lib/logging_pattern_layout_tagger.rb"

  # Objects will be converted to strings using the :format_as method.
  Logging.format_as :inspect

  # The default layout used by the appenders.
  layout = Logging.layouts.pattern(:pattern => '[%d] %-5l  %c : %m\n', :date_pattern => '%d-%b-%Y %H:%M:%S')
  request_tracing_layout = LoggingPatternLayoutTagger.new(layout)

  # Setup a color scheme called 'bright' than can be used to add color codes
  # to the pattern layout. Color schemes should only be used with appenders
  # that write to STDOUT or STDERR; inserting terminal color codes into a file
  # is generally considered bad form.
  #
  Logging.color_scheme( 'bright',
                        :levels => {
                            :info  => :green,
                            :warn  => :yellow,
                            :error => :red,
                            :fatal => [:white, :on_red]
                        },
                        :date => :blue,
                        :logger => :cyan,
                        :message => :magenta
  )

  # -------------------------------- Appenders configuration -----------------------------------------------------------

  # Configure an appender that will write log events to STDOUT. A colorized
  # pattern layout is used to format the log events into strings before
  # writing.
  Logging.appenders.stdout( 'stdout',
                            :auto_flushing => true,
                            :layout => LoggingPatternLayoutTagger.new(Logging.layouts.pattern(:pattern => layout.pattern, :date_pattern => layout.date_pattern, :color_scheme => 'bright'))
  )

  ## Configure an appender that will write log events to a file. The file will
  ## be rolled on a daily basis, and the past 14 rolled files will be kept (in production, 1 in other envs).
  ## Older files will be deleted.
  #Logging.appenders.rolling_file( 'file',
  #  :filename => config.paths.log.first,
  #  :keep => Rails.env.production? ? 14 : 1,
  #  :age => 'daily',
  #  :truncate => false,
  #  :auto_flushing => true,
  #  :layout => layout
  #) if config.log_to.include? 'file'

  # Configure an appender that will write log events to a file. The file will
  # be rolled on a daily basis, and the past 14 rolled files will be kept (in production, 1 in other envs).
  # Older files will be deleted.
  #Logging.appenders.rolling_file( 'default_file',
  #  :filename => config.paths.log.first,
  #  :keep => Rails.env.production? ? 14 : 1,
  #  :age => 'daily',
  #  :truncate => false,
  #  :auto_flushing => true,
  #  :layout => layout
  #)

  # Configure an appender that will write log events to a file. This appender will be used in cron rake tasks.
  Logging.appenders.rolling_file( 'file_web',
                                  :filename => File.join(Rails.root, '/log/', "web_my_rpm_#{Rails.env}.log"),
                                  :keep => Rails.env.production? ? 31 : 1,
                                  :age => 'daily',
                                  :truncate => false,
                                  :auto_flushing => true,
                                  :layout => request_tracing_layout
  )


  # Configure an appender that will write log events to a file. This appender will be used in delayed_job worker processes.
  Logging.appenders.rolling_file( 'file_other',
                                  :filename => File.join(Rails.root, '/log/', "other_my_rpm_#{Rails.env}.log"),
                                  :keep => Rails.env.production? ? 5 : 1,
                                  :age => 'daily',
                                  :truncate => false,
                                  :auto_flushing => true,
                                  :layout => request_tracing_layout
  )


  # Configure an appender that will send an email for "error" and "fatal" log
  # events. All other log events will be ignored. Furthermore, log events will
  # be buffered for one minute (or 200 events) before an email is sent. This
  # is done to prevent a flood of messages.
  #


  # Setup the root logger with the Rails log level and the desired set of
  # appenders. The list of appenders to use should be set in the environment
  # specific configuration file.
  #
  # For example, in a production application you would not want to log to
  # STDOUT, but you would want to send an email for "error" and "fatal"
  # messages:
  #
  # => config/environments/production.rb
  #
  #     config.log_to = %w[file email]
  #
  # In development you would want to log to STDOUT and possibly to a file:
  #
  # => config/environments/development.rb
  #
  #     config.log_to = %w[stdout file]
  #
  Logging.logger.root.level = config.log_level
  Logging.logger.root.appenders = config.log_to unless config.log_to.empty?

  # Under Phusion Passenger smart spawning, we need to reopen all IO streams
  # after workers have forked.
  #
  # The rolling file appender uses shared file locks to ensure that only one
  # process will roll the log file. Each process writing to the file must have
  # its own open file descriptor for flock to function properly. Reopening the
  # file descriptors afte forking ensure that each worker has a unique file
  # descriptor.
  #
  if defined?(PhusionPassenger)
    PhusionPassenger.on_event(:starting_worker_process) do |forked|
      Logging.reopen if forked
    end
  end

  config.disable_parameters_log_for_actions = []

end
