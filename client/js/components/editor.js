import {a7} from '/lib/altseven/dist/a7.js';

export var Editor = function Editor(props){
  const editor = a7.components.Constructor(a7.components.View, [props], true);

  editor.state = {
  };

   editor.on( "rendered", function(){
    editor.props.editor = CodeMirror.fromTextArea( document.querySelector( editor.props.selector +  " textarea[name='codeWindow']" ), {
      lineNumbers: true
    });

    editor.props.editor.refresh();

    editor.props.editor.on( "change", function(){
      a7.model.set( props.modelKey, editor.props.editor.getValue() );
    });
  });

  editor.eventHandlers = {
  };

  editor.template = function(){
    let templ = `<form>
    <br>
    <textarea name="codeWindow"></textarea>

    </form>`;
    return templ;
  };

  return editor;
}