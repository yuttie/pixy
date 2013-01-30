JSC = closure-compiler
JSCFLAGS = --compilation_level SIMPLE_OPTIMIZATIONS
JS = jquery-1.9.0.js pixy.js
MINIFIEDJS = pixy.min.js
STANDALONE_HTML = pixy.standalone.html


.PHONY: clean

$(STANDALONE_HTML): pixy.html pixy.css $(MINIFIEDJS)
	ruby embed.rb $^ >$@

$(MINIFIEDJS): $(JS)
	$(JSC) $(JSCFLAGS) --js $(JS) --js_output_file $@

clean:
	rm -f $(MINIFIEDJS) $(STANDALONE_HTML) *~
