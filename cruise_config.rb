Project.configure do |project|
	project.source_control = Subversion.new(:url =>'https://colorediffs.googlecode.com/svn/trunk')
	project.do_clean_checkout :every => 2.days

	project.email_notifier.emails = ['vadim.atlygin@gmail.com']
	project.email_notifier.from = 'vadim.atlygin@gmail.com'
end
