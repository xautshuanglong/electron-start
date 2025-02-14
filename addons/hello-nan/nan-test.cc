#include <nan.h>

void Method1(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  info.GetReturnValue().Set(Nan::New("hello world 1").ToLocalChecked());
}

void Init1(v8::Local<v8::Object> exports) {
  v8::Local<v8::Context> context =
      exports->GetCreationContext().ToLocalChecked();
  exports->Set(context,
               Nan::New("hello1").ToLocalChecked(),
               Nan::New<v8::FunctionTemplate>(Method1)->GetFunction(context).ToLocalChecked());
}

NODE_MODULE(hello1, Init1)
