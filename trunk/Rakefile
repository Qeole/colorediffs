#gem install json
#gem install rubyzip

require 'json/pure'
require 'zip/zip'
require 'openssl'
require 'files'

#some library extension to better life
class Zip::ZipFile
	def add_r(entry, src_path)
		if (File.directory?(src_path))
			Dir.foreach(src_path) do |f|
				add_r(File.join(entry, f), File.join(src_path, f)) unless f == "." || f == ".."
			end
		else
			add(entry, src_path)
		end
	end
end

class OpenStruct
	include Enumerable
	def each(&block)
		@table.each(&block)
	end
end

def convert(hash)
	if (hash.is_a?(Hash))
		OpenStruct.new(hash.each {|h, v| hash[h] = convert(v)})
	elsif (hash.is_a?(Array))
		hash.map {|a| convert(a)}
	else
		return hash
	end
end

class OpenSSL::Digest::SHA256
    def self.file(name)
    	new.file(name)
    end

    def file(name)
		File.open(name, "rb") {|f|
			buf = ""
			while f.read(16384, buf)
				update buf
			end
		}
		self
    end
end
#end library extensions

task :default => [:build]

task :cruise => [:test, :build] do |t|
	options = convert(JSON.parse(File.read("options.json")))
	options.sites.each {|s|
		Dir.foreach("#{s.name}-build") do |f|
			mv File.join("#{s.name}-build", f), File.join(ENV['CC_BUILD_ARTIFACTS'], "#{s.name}-#{f}") unless f == "." || f == ".."
		end
	}
end

file "../mykey.pem" do |t|
	cp File.expand_path("~/cc-private/mykey.pem"), t.name
end

task :test do |t|
	sh "java -cp test-framework/js.jar org.mozilla.javascript.tools.shell.Main -version 170 -debug test-framework/main.js --test-directory content/colorediffs/tests/"
end

task :build => "../mykey.pem" do |t|
	options = convert(JSON.parse(File.read("options.json")))
	options.version = options.version + "." + build_version
	options.sites.each {|s|
		create_one(s, options)
	}
end

def build_version
	Time.now.utc.strftime("%Y.%m.%d.%H.%M.%S");
end

def create_one(site, json)
	rm_rf "build"
	rm_rf "#{site.name}-build"

	mkdir "build"

	copy_file_list("build/chrome")
	mkdir_p "build/defaults/preferences"
	cp "defaults/preferences/#{json.info.nickname}.js", "build/defaults/preferences/"

	File.open("build/install.rdf", "w") {|f|;
		f << get_install_rdf(json, site)
	}

	cp "chrome.manifest.install", "build/chrome.manifest"

	puts "make build/chrome/#{json.info.nickname}.jar"
	Zip::ZipFile.open("build/chrome/#{json.info.nickname}.jar", Zip::ZipFile::CREATE) {|zf|
		zf.add_r("content", "build/chrome/content");
		zf.add_r("skin", "build/chrome/skin");
	}
	rm_rf "build/chrome/content"
	rm_rf "build/chrome/skin"

	puts "make build/#{json.info.nickname}-#{json.version}.xpi"
	Zip::ZipFile.open("build/#{json.info.nickname}-#{json.version}.xpi", Zip::ZipFile::CREATE) {|zf|
		zf.add_r("chrome", "build/chrome");
		zf.add_r("defaults", "build/defaults");
		zf.add_r("chrome.manifest", "build/chrome.manifest");
		zf.add_r("install.rdf", "build/install.rdf");
	}

	rm_rf "build/chrome"
	rm_rf "build/defaults"
	rm_rf "build/chrome.manifest"
	rm_rf "build/install.rdf"

	#make update.rdf
	if (site.upgrade_info != nil)
		file = "#{json.info.nickname}-#{json.version}.xpi"
		hash = "sha256:" + OpenSSL::Digest::SHA256.file("build/#{json.info.nickname}-#{json.version}.xpi").hexdigest
		private_key = OpenSSL::PKey::RSA.new(File.read("../mykey.pem"))
		openssl_signature = private_key.sign(OpenSSL::Digest::SHA512.new, get_update_rdf_signable(json, site, file, hash, nil)).unpack("H*").first
		signature = ["308193300d06092a864886f70d01010d050003818100" + openssl_signature].pack("H*")
		signature_base64 = [signature].pack("m").gsub("\n", "")

		File.open("build/update.rdf", "w") { |f|
			f << get_update_rdf(json, site, file, hash, signature_base64)
		}
	end

	mv "build", "#{site.name}-build"
end

def copy_file_list(to_dir)
	$files.each {|fl|
		path = to_dir + "/" + fl
		dir = File.dirname(path)
		if (! File.directory?(dir))
			mkdir_p dir
		end
		cp fl, path
	}
end

def get_install_rdf(json, site)
	upgrade_info = if (site.upgrade_info != nil) then site.upgrade_info.install_rdf.map{|n, v| "em:#{n}='#{v}'" }.join("\n") else '' end
	text =<<-END
<?xml version="1.0"?>
<RDF:RDF xmlns:em="http://www.mozilla.org/2004/em-rdf#"
		 xmlns:NC="http://home.netscape.com/NC-rdf#"
		 xmlns:RDF="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <RDF:Description RDF:about="urn:mozilla:install-manifest"
				   em:id="#{json.info.eid}"
				   em:name="#{json.info.name}"
				   em:version="#{json.version}"
				   em:creator="#{json.info.creator}"
				   em:description="#{json.info.description}"
				   em:homepageURL="#{json.info.homepageURL}"
				   em:iconURL="#{json.info.iconURL}"
				   em:optionsURL="#{json.info.optionsURL}"
				   #{upgrade_info}>
#{get_target_apps(json.apps, {}, '    ')}
  </RDF:Description>
</RDF:RDF>
END
end

def get_update_rdf(json, site, file, hash, signature)
	text =<<-END
<?xml version="1.0"?>
<RDF:RDF xmlns:RDF="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:em="http://www.mozilla.org/2004/em-rdf#">
#{get_update_rdf_signable(json, site, file, hash, signature)}
</RDF:RDF>
END
end


# be careful changing the code below. It has to produce the exact same string.
# if there's new params to be added, please check what output
#   $ ruby normalize_update_rdf.rb update.rdf "urn:mozilla:extension:{282C3C7A-15A8-4037-A30D-BBEB17FFC76B}"
# produce. To get normalize_update_rdf.rb run $ git clone git://github.com/bard/spock.git
# If the format breaks, even if just white spaces are changed, validation of signature will fail and update
#   process will be broken beyond repair.
def get_update_rdf_signable(json, site, file, hash, signature)
	signature = if (signature) then "\n  <em:signature>#{signature}</em:signature>" else "" end
	text =<<-END
<RDF:Description about="urn:mozilla:extension:#{json.info.eid}">#{signature}
  <em:updates>
    <RDF:Seq>
      <RDF:li>
        <RDF:Description>
#{get_target_apps(json.apps, {:updateHash=>hash, :updateLink => "#{site.upgrade_info.update_rdf.update_link}#{file}"}, '          ')}
          <em:version>#{json.version}</em:version>
        </RDF:Description>
      </RDF:li>
    </RDF:Seq>
  </em:updates>
</RDF:Description>
END
end

def get_target_apps(apps, additional, pad)
	add = additional.map{|n, v| "#{pad}    <em:#{n}>#{v}</em:#{n}>" }.join("\n")
	apps.map{|app|
		text = <<-END
#{pad}<em:targetApplication>
#{pad}  <RDF:Description>
#{pad}    <em:id>#{app.aid}</em:id>
#{pad}    <em:maxVersion>#{app.maxVersion}</em:maxVersion>
#{pad}    <em:minVersion>#{app.minVersion}</em:minVersion>
#{add}
#{pad}  </RDF:Description>
#{pad}</em:targetApplication>
END
	}.join("").chop
end

