require File.expand_path('../boot', __FILE__)

require 'rails/all'

# If you have a Gemfile, require the gems listed there, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(:default, Rails.env) if defined?(Bundler)

module MyRpm
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Custom directories with classes and modules you want to be autoloadable.
    # config.autoload_paths += %W(#{config.root}/extras)
    config.autoload_paths += %w(app/classes  app/middlewares).collect{|p| "#{config.root}/#{p}" }

    # Only load the plugins named here, in the order given (default is alphabetical).
    # :all can be used as a placeholder for all plugins not explicitly named.
    # config.plugins = [ :exception_notification, :ssl_requirement, :all ]

    # Activate observers that should always be running.
    # config.active_record.observers = :cacher, :garbage_collector, :forum_observer

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'
    config.time_zone = 'Jerusalem'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    # JavaScript files you want as :defaults (application.js is always included).
    # config.action_view.javascript_expansions[:defaults] = %w(jquery rails)
    config.action_view.javascript_expansions[:lib] = %w{jquery.filterbar  text-expander-initializer   fancybox-initializer   qtip-initializer   forms-initializer   togglebar-initializer}.collect{|js| "lib/#{js}"}
    config.action_view.javascript_expansions[:jquery] = %w(
            jquery-1.7.2   rails
            jquery-ui/jquery.ui.core-1.8.16   jquery-ui/jquery.ui.position-1.8.16   jquery-ui/jquery.ui.widget-1.8.16   jquery-ui/jquery.ui.mouse-1.8.16
            jquery-ui/jquery.ui.draggable-1.8.16   jquery-ui/jquery.ui.droppable-1.8.16   jquery-ui/jquery.ui.sortable-1.8.16
            jquery-ui/datepicker/jquery.ui.datepicker-1.8.16   jquery-ui/datepicker/jquery.ui.datepicker-en   jquery-ui/datepicker/jquery.ui.datepicker-he
            jquery.autosize
            jquery.qtip   jquery.fancybox-1.3.4
            jquery.expander-1.4.2.min   jquery.to_json
            jquery.togglebar
            jquery.jqext   jquery.jqlog   jquery.keynav
            jquery.mousewheel
        ).collect { |js| "vendor/#{js}" }

    # Configure the default encoding used in templates for Ruby 1.9.
    config.encoding = "utf-8"

    # Configure sensitive parameters which will be filtered from the log file.
    config.filter_parameters += [:password]

    # --------------------- app_usage configuration variable detection -------------------------------------------------------------------------
    #ENV['RAILS_APP_USAGE'] ||= 'console' if Rails.env.development? && defined?(Rails::Console)
    config.app_usage = ENV['RAILS_APP_USAGE']
    config.app_usage = 'web' if config.app_usage.blank? && defined?(::PhusionPassenger) # if blank, try to auto detect
    config.app_usage = 'other' unless %w(web cron_rake console).include?(config.app_usage)

    #------------------------------------------------------ logging gem configurations - set logging destinations (appenders) ------------------------------------------------------
    # Set the logging destinations - appenders
    config.log_to = %W(file_#{config.app_usage})
  end
end
