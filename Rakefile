#gem install json
#gem install rubyzip

require 'json/pure'
require 'zip/zip'
require 'digest'
require 'digest/sha2'
require 'openssl'

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

task :default => [:build]
task :cruise => [:build]

file "mykey.pem" do |t|
	cp File.expand_path("~/cc-private/mykey.pem"), t.name
end

task :build => "mykey.pem" do |t|
	options = convert(JSON.parse(File.read("options.json")))
	options.version = options.version + "." + get_svn_rev
	options.sites.each {|s|
		create_one(s, options)
	}
end

def get_svn_rev
	revision = ""
	IO.popen("svn info") { |f|
		revision = f.gets(nil).scan(/^Revision: (.*)$/)[0][0]
	}
	return revision
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
		hash = "sha256:" + Digest::SHA256.file("build/#{json.info.nickname}-#{json.version}.xpi").hexdigest
		private_key = OpenSSL::PKey::RSA.new(File.read("mykey.pem"))
		openssl_signature = private_key.sign(OpenSSL::Digest::SHA512.new, get_update_rdf_signable(json, site, file, hash, nil)).unpack("H*").first
		signature = ["308193300d06092a864886f70d01010d050003818100" + openssl_signature].pack("H*")
		signature_base64 = [signature].pack("m").gsub("\n", "")

		File.open("build/update.rdf", "w") { |f|
			f << get_update_rdf(json, site, file, hash, signature_base64)
		}
	end

	mv "build", "#{site.name}-build"
end

$files = FileList.new([
	"content/colorediffs/callbacks.js",
	"content/colorediffs/colorediffs.js",
	"content/colorediffs/contents.rdf",
	"content/colorediffs/dom.js",
	"content/colorediffs/globals.js",
	"content/colorediffs/icon.png",
	"content/colorediffs/ilUtils.js",
	"content/colorediffs/main-overlay.xul",
	"content/colorediffs/msgwindowoverlay.xul",
	"content/colorediffs/overlay.js",
	"content/colorediffs/overlay.xul",
	"content/colorediffs/prefs.js",
	"content/colorediffs/toolbar.js",

	"content/colorediffs/bindings/bindings.css",
	"content/colorediffs/bindings/colorpicker.css",
	"content/colorediffs/bindings/main-bindings.xbl",

	"content/colorediffs/options/context-view-options.xul",
	"content/colorediffs/options/unified-view-options.xul",
	"content/colorediffs/options/side-by-side-view-options.xul",
	"content/colorediffs/options/options.css",
	"content/colorediffs/options/options.js",
	"content/colorediffs/options/options.xul",
	"content/colorediffs/options/options-pref.js",
	"content/colorediffs/options/options-pref-callback.js",

	"content/colorediffs/parsers/main-parser.js",
	"content/colorediffs/parsers/context-parser.js",
	"content/colorediffs/parsers/unified-parser.js",

	"content/colorediffs/transformations/composite-transformation.js",
	"content/colorediffs/transformations/composite-init.js",
	"content/colorediffs/transformations/composite-run.js",
	"content/colorediffs/transformations/make-lines-equal-length.js",
	"content/colorediffs/transformations/find-common-name.js",
	"content/colorediffs/transformations/detect-old-new-files.js",
	"content/colorediffs/transformations/select-old-new-files.js",
	"content/colorediffs/transformations/truncate-file-names.js",
	"content/colorediffs/transformations/add-title.js",
	"content/colorediffs/transformations/main-transformation.js",
	"content/colorediffs/transformations/escape-html-special-characters-transformation.js",
	"content/colorediffs/transformations/replace-file-names-transformation.js",
	"content/colorediffs/transformations/replace-tabs.js",
	"content/colorediffs/transformations/show-whitespaces-transformation.js",
	"content/colorediffs/transformations/show-line-numbers.js",
	"content/colorediffs/transformations/collect-tab-sizes.js",
	"content/colorediffs/transformations/calc-chunk-size.js",
	"content/colorediffs/transformations/strip-html.js",

	"content/colorediffs/views/main-view.js",
	"content/colorediffs/views/side-by-side-view.js",
	"content/colorediffs/views/unified-view.js",
	"content/colorediffs/views/context-view.js",

	"skin/colorediffs.css",
	"skin/white-space.png",
	"skin/line-numbers.png",
	"skin/options.png"
])

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
	  <em:file RDF:resource="urn:mozilla:extension:file:#{json.info.nickname}.jar"/>
  </RDF:Description>
  <RDF:Description RDF:about="urn:mozilla:extension:file:#{json.info.nickname}.jar"
				   em:package="content/#{json.info.nickname}/" />
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

def get_update_rdf_signable(json, site, file, hash, signature)
	signature = if (signature) then "\n  <em:signature>#{signature}</em:signature>" else "" end
	text =<<-END
<RDF:Description about="urn:mozilla:extension:{282C3C7A-15A8-4037-A30D-BBEB17FFC76B}">#{signature}
  <em:updates>
    <RDF:Seq>
      <RDF:li>
        <RDF:Description>
#{get_target_apps(json.apps, {:updateLink => "#{site.upgrade_info.update_rdf.update_link}#{file}", :updateHash=>hash}, '          ')}
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
