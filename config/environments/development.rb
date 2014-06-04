MyRpm::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb

  # In the development environment your application's code is reloaded on
  # every request.  This slows down response time but is perfect for development
  # since you don't have to restart the webserver when you make code changes.
  config.cache_classes = false

  # Log error messages when you accidentally call methods on nil.
  config.whiny_nils = true

  # Show full error reports and disable caching
  config.consider_all_requests_local       = true
  config.action_view.debug_rjs             = true
  config.action_controller.perform_caching = false

  # Don't care if the mailer can't send
  config.action_mailer.raise_delivery_errors = false

  # Print deprecation notices to the Rails logger
  config.active_support.deprecation = :log

  # Only use best-standards-support built into browsers
  config.action_dispatch.best_standards_support = :builtin

  config.logger = Logger.new(Rails.root.join("log", Rails.env + ".log"), 1, 50*1024*1024)

  #config.log_to << 'stdout' unless defined? Rails::Console # DO NOT ADD stdout appender, if application is started using 'rails console' (we don't want logging statements in console)
  config.log_to << 'stdout' if config.app_usage == 'web'

  # this is ugly trick to avoid printing Logger configuration in logging-rails/lib/logging/rails/railtie.rb
  Logging.logger['Rails'].level = :info
  config.after_initialize do
    Logging.logger['Rails'].level = :debug
  end

end

