from algopy import ARC4Contract, String ,subroutine
from algopy.arc4 import abimethod


class HelloWorld(ARC4Contract):
    @abimethod()
    def hello(self, name: String) -> String:
        return "Hello, " + name

    @abimethod()
    def use_global_storage(self , val1 : String,) -> None :
        
        self.clear_global_storage()
        self.storage1 = val1

    @subroutine
    def clear_global_storage(self)->None:
        self.storage1 = String("")
        self.storage2 = String("")
        self.storage3 = String("")
        self.storage4 = String("")
        self.storage5 = String("")
        self.storage6 = String("")
        self.storage7 = String("")
        self.storage8 = String("")
        self.storage9 = String("")
        self.storage10 = String("")