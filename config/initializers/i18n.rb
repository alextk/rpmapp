I18n::Backend::Chain.send(:include, I18n::Backend::Cache)
I18n.cache_store = ActiveSupport::Cache.lookup_store(:memory_store)
I18n.available_locales=[:"he-IL"]
I18n.locale = 'he-IL'
I18n.default_locale = 'he-IL'