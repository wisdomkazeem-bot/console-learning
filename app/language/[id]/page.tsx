"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Each language has at least 10 topics. Topics have title, a brief description, references, and a video.
const LANGUAGE_TOPICS: Record<
  string,
  { title: string; description: string; references: string[]; video?: string }[]
> = {
  c: [
    { title: "Variables", description: "Statically typed storage locations for values. Must be declared before use. Types: int, float, char, double.", references: ["https://www.learn-c.org/en/Variables"], video: "https://www.youtube.com/watch?v=KJgsSFOSQv0" },
    { title: "Arrays", description: "Contiguous blocks of memory with elements of the same type. Indexed starting at 0.", references: ["https://www.learn-c.org/en/Arrays"], video: "https://www.youtube.com/watch?v=9EmQYkJDE6w" },
    { title: "Pointers", description: "Variables storing memory addresses. Used for dynamic memory, arrays, data structures.", references: ["https://www.learn-c.org/en/Pointers"], video: "https://www.youtube.com/watch?v=sxTFSDAZM8s" },
    { title: "Functions", description: "Reusable blocks of logic. Can accept parameters and return values.", references: ["https://www.learn-c.org/en/Functions"], video: "https://www.youtube.com/watch?v=htfA9bAwr8M" },
    { title: "Structs", description: "Custom data types grouping variables of different types under a single name.", references: ["https://www.programiz.com/c-programming/c-structures"], video: "https://www.youtube.com/watch?v=K-A2VfuUROg" },
    { title: "File IO", description: "Reading and writing files using stdio.h functions: fopen, fclose, fread, fwrite.", references: ["https://www.learn-c.org/en/File_Input/output"], video: "https://www.youtube.com/watch?v=6kL27G2JjZA" },
    { title: "Memory", description: "Dynamic memory allocation (malloc, calloc, realloc, free), stack vs heap.", references: ["https://www.geeksforgeeks.org/dynamic-memory-allocation-in-c-using-malloc-calloc-free-and-realloc/"], video: "https://www.youtube.com/watch?v=_8-ht2AKyH4" },
    { title: "Strings", description: "Null-terminated arrays of characters. Manipulated via <string.h> library.", references: ["https://www.learn-c.org/en/Strings"], video: "https://www.youtube.com/watch?v=jCzT9XFZ5bw" },
    { title: "Loops", description: "Control flow for repeated execution: for, while, do-while loops.", references: ["https://www.programiz.com/c-programming/c-for-loop"], video: "https://www.youtube.com/watch?v=7K8WCHq8GgY" },
    { title: "Preprocessor", description: "Instructions that run before compilation. Handles #include, #define, #ifdef.", references: ["https://www.tutorialspoint.com/cprogramming/c_preprocessors.htm"], video: "https://www.youtube.com/watch?v=sUVN3mXZ1nI" }
  ],
  cpp: [
    { title: "Variables", description: "Typed storage for values, including primitives (int, double), strings, and custom types.", references: ["https://www.learncpp.com/cpp-tutorial/variables-and-basic-types/"], video: "https://www.youtube.com/watch?v=mUQZ1qmKlLY" },
    { title: "Arrays", description: "Sequential fixed-size containers. Use STL vector for dynamic arrays.", references: ["https://www.learncpp.com/cpp-tutorial/arrays-part-i-introduction-to-arrays/"], video: "https://www.youtube.com/watch?v=9oKlW5wi5nc" },
    { title: "Pointers", description: "Variables holding memory addresses. Raw or smart; crucial for dynamic memory and data structures.", references: ["https://www.learncpp.com/cpp-tutorial/introduction-to-pointers/"], video: "https://www.youtube.com/watch?v=DTxHyVn0ODg" },
    { title: "Classes", description: "Encapsulate data and behavior. Support for access control and construct/destruct.", references: ["https://www.learncpp.com/cpp-tutorial/introduction-to-classes/"], video: "https://www.youtube.com/watch?v=1v_4dL8l2JQ" },
    { title: "Inheritance", description: "Create subclasses with is-a relationship. Allows for polymorphism.", references: ["https://www.learncpp.com/cpp-tutorial/introduction-to-inheritance/"], video: "https://www.youtube.com/watch?v=u5GAVdLQyIg" },
    { title: "Templates", description: "Generic programming for functions and classes. Enables code reuse for any data type.", references: ["https://www.learncpp.com/cpp-tutorial/introduction-to-templates/"], video: "https://www.youtube.com/watch?v=I-hZkUa9mIs" },
    { title: "STL", description: "Standard Template Library: Data structures (vector, map, stack), algorithms, iterators.", references: ["https://www.geeksforgeeks.org/the-c-standard-template-library-stl/"], video: "https://www.youtube.com/watch?v=Os6S1pROpww" },
    { title: "Dynamic Memory", description: "Allocate memory on the heap with new/delete. Use smart pointers.", references: ["https://www.learncpp.com/cpp-tutorial/dynamic-memory-allocation-with-new-and-delete/"], video: "https://www.youtube.com/watch?v=nZmZX6eykz8" },
    { title: "Exceptions", description: "try/catch/throw structured error handling with custom exception types.", references: ["https://www.learncpp.com/cpp-tutorial/introduction-to-exception-handling/"], video: "https://www.youtube.com/watch?v=-I7c5UQUZtA" },
    { title: "Namespaces", description: "Avoid name conflicts and organize code logically. Use namespace std and custom.", references: ["https://www.learncpp.com/cpp-tutorial/introduction-to-namespaces/"], video: "https://www.youtube.com/watch?v=Suldz2KRk_M" }
  ],
  csharp: [
    { title: "Variables", description: "Type-safe variables holding data in memory. Built-in and custom types.", references: ["https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/variables/"], video: "https://www.youtube.com/watch?v=GhQdlIFylQ8" },
    { title: "Arrays", description: "Collections of fixed length storing elements of the same type.", references: ["https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/arrays/"], video: "https://www.youtube.com/watch?v=f4E4Xz76dHg" },
    { title: "Classes", description: "Object-oriented foundation with data fields, properties, methods, and events.", references: ["https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/classes"], video: "https://www.youtube.com/watch?v=y73y8FxWfJ0" },
    { title: "Interfaces", description: "Define contracts for classes to implement.", references: ["https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/interfaces/"], video: "https://www.youtube.com/watch?v=9fcTqg6K3j4" },
    { title: "LINQ", description: "Powerful language-integrated query for collections, XML, SQL, more.", references: ["https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/"], video: "https://www.youtube.com/watch?v=Pn1g1wjxl1A" },
    { title: "Async Await", description: "Simplify async code for responsive GUI/web apps.", references: ["https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/async/"], video: "https://www.youtube.com/watch?v=yd71LWhCO4s" },
    { title: "Generics", description: "Generic types and methods for reusable, type-safe code.", references: ["https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/generics/"], video: "https://www.youtube.com/watch?v=9ZH6bTX9W2g" },
    { title: "Delegates", description: "Type-safe function pointers for callbacks and event handlers.", references: ["https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/delegates/"], video: "https://www.youtube.com/watch?v=gI-qXk7XojA" },
    { title: "Events", description: "Event-driven programming for GUI/apps using delegates.", references: ["https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/events/"], video: "https://www.youtube.com/watch?v=SF52YwGP1BM" },
    { title: "Attributes", description: "Annotate code with metadata for tools, frameworks, and reflection.", references: ["https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/attributes/"], video: "https://www.youtube.com/watch?v=ABzZa6gR2YM" }
  ],
  rust: [
    { title: "Variables", description: "Immutable by default, explicit mutability, strong typing.", references: ["https://doc.rust-lang.org/book/ch03-01-variables-and-mutability.html"], video: "https://www.youtube.com/watch?v=ygL_xcavzQ4" },
    { title: "Ownership", description: "Unique feature tracking value lifetimes at compile time.", references: ["https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html"], video: "https://www.youtube.com/watch?v=8MIMfHtxbYI" },
    { title: "Borrowing", description: "References (&/&mut) control read-write access and aliasing.", references: ["https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html"], video: "https://www.youtube.com/watch?v=8MIMfHtxbYI" },
    { title: "Structs", description: "Combine named fields into composite types.", references: ["https://doc.rust-lang.org/book/ch05-01-defining-structs.html"], video: "https://www.youtube.com/watch?v=YZyGGwXvP6o" },
    { title: "Enums", description: "Define variants with or without data (like sum types).", references: ["https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html"], video: "https://www.youtube.com/watch?v=wC6dDbr3mQI" },
    { title: "Pattern Matching", description: "Powerful match statement for inspecting values.", references: ["https://doc.rust-lang.org/book/ch06-02-match.html"], video: "https://www.youtube.com/watch?v=eaIvk1cSyG8" },
    { title: "Traits", description: "Share behavior, like interfaces in other languages.", references: ["https://doc.rust-lang.org/book/ch10-02-traits.html"], video: "https://www.youtube.com/watch?v=PYB5x31eRYc" },
    { title: "Generics", description: "Write functions, structs, enums abstracted over types.", references: ["https://doc.rust-lang.org/book/ch10-01-syntax.html"], video: "https://www.youtube.com/watch?v=4F9pkuqtHr8" },
    { title: "Error Handling", description: "Robust built-in strategy: Result, Option, panic.", references: ["https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html"], video: "https://www.youtube.com/watch?v=_P6SLYHAVOk" },
    { title: "Concurrency", description: "Threads, channels, and fearless concurrency.", references: ["https://doc.rust-lang.org/book/ch16-00-concurrency.html"], video: "https://www.youtube.com/watch?v=Ek9Fy68d6mc" }
  ],
  go: [
    { title: "Variables", description: "Strongly-typed, statically declared with var or :=; zero values on creation.", references: ["https://tour.golang.org/basics/8"], video: "https://www.youtube.com/watch?v=yyUHQIec83I" },
    { title: "Functions", description: "First-class, support multiple return values and closures.", references: ["https://tour.golang.org/basics/4"], video: "https://www.youtube.com/watch?v=f6kdp27TYZs" },
    { title: "Arrays", description: "Fixed-size sequences. Use slices for flexible arrays.", references: ["https://tour.golang.org/moretypes/7"], video: "https://www.youtube.com/watch?v=zm5qg5Hz1RY" },
    { title: "Structs", description: "Composite user-defined types holding fields.", references: ["https://tour.golang.org/moretypes/2"], video: "https://www.youtube.com/watch?v=ytEk_gnZ9-A" },
    { title: "Interfaces", description: "Implicitly satisfied contracts for types.", references: ["https://tour.golang.org/methods/9"], video: "https://www.youtube.com/watch?v=F4wUrj6pngc" },
    { title: "Goroutines", description: "Lightweight thread, run concurrently.", references: ["https://tour.golang.org/concurrency/1"], video: "https://www.youtube.com/watch?v=8DvywoWv6fI" },
    { title: "Channels", description: "Communication and synchronization between goroutines.", references: ["https://tour.golang.org/concurrency/2"], video: "https://www.youtube.com/watch?v=KBZlN0izeiY" },
    { title: "Error Handling", description: "Errors are values, handled explicitly, with idiomatic checks.", references: ["https://blog.golang.org/error-handling-and-go"], video: "https://www.youtube.com/watch?v=26ahsUf4sF8" },
    { title: "Packages", description: "Code organization; import/export rules.", references: ["https://golang.org/doc/code.html"], video: "https://www.youtube.com/watch?v=Mt6GbJ4ddf8" },
    { title: "HTTP", description: "Net/http for simple web servers and networked clients.", references: ["https://pkg.go.dev/net/http"], video: "https://www.youtube.com/watch?v=VlnU2Kfa6_w" }
  ],
  java: [
    { title: "Variables", description: "Strongly typed with explicit declaration: primitives and object references.", references: ["https://docs.oracle.com/javase/tutorial/java/nutsandbolts/variables.html"], video: "https://www.youtube.com/watch?v=BXtmP5yB_K0" },
    { title: "Arrays", description: "Fixed-size sequences of any type. Use ArrayList for flexible collections.", references: ["https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html"], video: "https://www.youtube.com/watch?v=tP6BHZMMG6Y" },
    { title: "Classes", description: "Encapsulation of data and methods. Supports inheritance and polymorphism.", references: ["https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html"], video: "https://www.youtube.com/watch?v=GGkBU5L3-Wg" },
    { title: "Inheritance", description: "Class extension for code reuse and polymorphism.", references: ["https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html"], video: "https://www.youtube.com/watch?v=9GLoEW7YlZ8" },
    { title: "Interfaces", description: "Define contracts for classes; support multiple inheritance of type.", references: ["https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html"], video: "https://www.youtube.com/watch?v=6hyU7jcdwgU" },
    { title: "Generics", description: "Parameterized types for collections and methods.", references: ["https://docs.oracle.com/javase/tutorial/java/generics/"], video: "https://www.youtube.com/watch?v=K1iu1kXkVoA" },
    { title: "Collections", description: "List, Set, Map interfaces and implementations.", references: ["https://docs.oracle.com/javase/tutorial/collections/"], video: "https://www.youtube.com/watch?v=kjBoEf7m6yQ" },
    { title: "Exceptions", description: "Structured error handling with try/catch/finally.", references: ["https://docs.oracle.com/javase/tutorial/essential/exceptions/"], video: "https://www.youtube.com/watch?v=Tt8O8Mm94V4" },
    { title: "Threads", description: "Concurrent programming using Thread, Runnable, and synchronization.", references: ["https://docs.oracle.com/javase/tutorial/essential/concurrency/"], video: "https://www.youtube.com/watch?v=9LUplIX8EXo" },
    { title: "Streams", description: "Stream API for functional-style operations on data.", references: ["https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html"], video: "https://www.youtube.com/watch?v=t1-YZ6bF-g0" }
  ],
  bash: [
    { title: "Variables", description: "Shell variables store strings or command output. No type enforcement.", references: ["https://tldp.org/LDP/Bash-Beginners-Guide/html/sect_03_02.html"], video: "https://www.youtube.com/watch?v=hwrnmQumtPw" },
    { title: "Echo", description: "Outputs text or variable values to the terminal.", references: ["https://linuxize.com/post/bash-echo-command/"], video: "https://www.youtube.com/watch?v=QvfQDoY6Sws" },
    { title: "If Else", description: "Conditional branching, test expressions with if, elif, else.", references: ["https://tldp.org/LDP/abs/html/testconstructs.html"], video: "https://www.youtube.com/watch?v=v-F3YLd6oMw" },
    { title: "Loops", description: "for, while, and until loops. Iterate over arguments or files.", references: ["https://tldp.org/LDP/abs/html/loops1.html"], video: "https://www.youtube.com/watch?v=dJB4QfFAI7g" },
    { title: "Functions", description: "Reusable script code blocks. Called as commands within the script.", references: ["https://tldp.org/LDP/abs/html/functions.html"], video: "https://www.youtube.com/watch?v=dJB4QfFAI7g" },
    { title: "File Operations", description: "Read, create, and append files. Use redirection (> >> <), cat, etc.", references: ["https://www.geeksforgeeks.org/how-to-work-with-files-in-bash/"], video: "https://www.youtube.com/watch?v=_kA0bGdXE0I" },
    { title: "Arrays", description: "Space-separated lists; accessed with ${arr[0]}.", references: ["https://www.tutorialspoint.com/unix/unix-shell-arrays.htm"], video: "https://www.youtube.com/watch?v=RW9pF-sFVZQ" },
    { title: "String Operations", description: "Find, replace, manipulate text with built-ins and tools.", references: ["https://www.shell-tips.com/bash/string/"], video: "https://www.youtube.com/watch?v=xpF4ChK4ZFw" },
    { title: "Pipes", description: "Pass command output as input to another command.", references: ["https://tldp.org/HOWTO/Bash-Prog-Intro-HOWTO-3.html"], video: "https://www.youtube.com/watch?v=F4IUznJspbo" },
    { title: "Cron", description: "Automate tasks by scheduling scripts via crontab.", references: ["https://crontab.guru/"], video: "https://www.youtube.com/watch?v=3zQnQm7bssw" }
  ],
  php: [
    { title: "Variables", description: "Begin with $. Dynamic typing. Strings, numbers, arrays.", references: ["https://www.php.net/manual/en/language.variables.basics.php"], video: "https://www.youtube.com/watch?v=OK_JCtrrv-c" },
    { title: "Arrays", description: "Indexed and associative lists of values. Arrays are flexible.", references: ["https://www.php.net/manual/en/language.types.array.php"], video: "https://www.youtube.com/watch?v=3t5U4k3kHJU" },
    { title: "Functions", description: "Reusable code, takes parameters and returns values.", references: ["https://www.php.net/manual/en/functions.user-defined.php"], video: "https://www.youtube.com/watch?v=b3Fuh9JpWkI" },
    { title: "Classes", description: "OOP support: encapsulate state, methods, inheritance.", references: ["https://www.php.net/manual/en/language.oop5.php"], video: "https://www.youtube.com/watch?v=OnC1QdHMDfQ" },
    { title: "Forms", description: "Handle HTML forms with $_GET, $_POST, validation.", references: ["https://www.w3schools.com/php/php_forms.asp"], video: "https://www.youtube.com/watch?v=Q7AOvWpIVHU" },
    { title: "Sessions", description: "Web session management with $_SESSION global.", references: ["https://www.php.net/manual/en/book.session.php"], video: "https://www.youtube.com/watch?v=No5IWbGqd3I" },
    { title: "File IO", description: "Read/write files with fopen, fread, fwrite.", references: ["https://www.php.net/manual/en/function.fopen.php"], video: "https://www.youtube.com/watch?v=k2K1QF92Kp8" },
    { title: "MySQL", description: "Database connection and queries using mysqli/PDO.", references: ["https://www.php.net/manual/en/book.mysqli.php"], video: "https://www.youtube.com/watch?v=7S_tz1z_5bA" },
    { title: "APIs", description: "Use curl or HTTP stream wrappers to consume web services.", references: ["https://www.php.net/manual/en/book.curl.php"], video: "https://www.youtube.com/watch?v=HgyouUi11zk" },
    { title: "Composer", description: "Dependency manager for PHP. Defines autoloading, dependencies.", references: ["https://getcomposer.org/"], video: "https://www.youtube.com/watch?v=Hup5pGhF6o0" }
  ],
  ruby: [
    { title: "Variables", description: "Hold references to data. Dynamic types.", references: ["https://ruby-doc.org/core-2.7.0/doc/syntax/variables_rdoc.html"], video: "https://www.youtube.com/watch?v=t_ispmWmdjY" },
    { title: "Arrays", description: "Ordered list collection.", references: ["https://ruby-doc.org/core-2.7.0/Array.html"], video: "https://www.youtube.com/watch?v=8COC7SvWHT8" },
    { title: "Hashes", description: "Dictionary mapping keys to values.", references: ["https://ruby-doc.org/core-2.7.0/Hash.html"], video: "https://www.youtube.com/watch?v=Zkh0k1WReSE" },
    { title: "Classes", description: "Define data types and behavior.", references: ["https://www.ruby-lang.org/en/documentation/quickstart/3/"], video: "https://www.youtube.com/watch?v=6YQZTzrVhZU" },
    { title: "Modules", description: "Namespaces or mixins for shared behavior.", references: ["https://ruby-doc.org/core-2.7.0/Module.html"], video: "https://www.youtube.com/watch?v=S245TWnZAAo" },
    { title: "Blocks", description: "Anonymous chunks of code (closures).", references: ["https://ruby-doc.org/core-2.7.0/doc/syntax/control_expressions_rdoc.html#label-Blocks"], video: "https://www.youtube.com/watch?v=UllZnIZKuB8" },
    { title: "Iterators", description: "Loop over collections and ranges.", references: ["https://ruby-doc.org/core-2.7.0/Enumerable.html"], video: "https://www.youtube.com/watch?v=8COC7SvWHT8" },
    { title: "File IO", description: "Read and write files.", references: ["https://ruby-doc.org/core-2.7.0/File.html"], video: "https://www.youtube.com/watch?v=U6paM32QGPo" },
    { title: "Gems", description: "Ruby's package management system.", references: ["https://guides.rubygems.org/what-is-a-gem/"], video: "https://www.youtube.com/watch?v=OaTytBJFdFs" },
    { title: "Regex", description: "Regular expressions for pattern matching.", references: ["https://ruby-doc.org/core-2.7.0/Regexp.html"], video: "https://www.youtube.com/watch?v=gIyH7LEQnpw" }
  ],
  swift: [
    { title: "Variables", description: "Declare mutable (var) or immutable (let) references.", references: ["https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Declaring-Constants-and-Variables"], video: "https://www.youtube.com/watch?v=comQ1-x2a1Q" },
    { title: "Arrays", description: "Ordered collection type.", references: ["https://docs.swift.org/swift-book/documentation/the-swift-programming-language/collectiontypes/"], video: "https://www.youtube.com/watch?v=hgkBHDShQZU" },
    { title: "Optionals", description: "Variables that can hold nil or a value.", references: ["https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Optionals"], video: "https://www.youtube.com/watch?v=3N1qnTQY1wc" },
    { title: "Classes", description: "Reusable, reference-type objects.", references: ["https://docs.swift.org/swift-book/documentation/the-swift-programming-language/classesandstructures/"], video: "https://www.youtube.com/watch?v=60Y22zheUqI" },
    { title: "Structs", description: "Grouped value types. Copied on assignment.", references: ["https://docs.swift.org/swift-book/documentation/the-swift-programming-language/structuresandclasses/"], video: "https://www.youtube.com/watch?v=EO2zrSC6f40" },
    { title: "Protocols", description: "Blueprints for methods and properties.", references: ["https://docs.swift.org/swift-book/documentation/the-swift-programming-language/protocols/"], video: "https://www.youtube.com/watch?v=r-KnR3hS9Wg" },
    { title: "Closures", description: "Blocks of code that can be used as values.", references: ["https://docs.swift.org/swift-book/documentation/the-swift-programming-language/closures/"], video: "https://www.youtube.com/watch?v=DO3lP3C2Y_0" },
    { title: "Enums", description: "Enumerations; define a common type for a group of related values.", references: ["https://docs.swift.org/swift-book/documentation/the-swift-programming-language/enumerations/"], video: "https://www.youtube.com/watch?v=sRWbI19KPhw" },
    { title: "Error Handling", description: "Structured error capture with try/catch.", references: ["https://docs.swift.org/swift-book/documentation/the-swift-programming-language/errorhandling/"], video: "https://www.youtube.com/watch?v=6EJ3_7_Bs9E" },
    { title: "Generics", description: "Generalize code for multiple types.", references: ["https://docs.swift.org/swift-book/documentation/the-swift-programming-language/generics/"], video: "https://www.youtube.com/watch?v=MqwrwLkqZ88" }
  ],
  kotlin: [
    { title: "Variables", description: "Immutable (val) or mutable (var) variables, smart type inference.", references: ["https://kotlinlang.org/docs/basic-syntax.html#variables"], video: "https://www.youtube.com/watch?v=sXLQv1hksjU" },
    { title: "Arrays", description: "Array<T> and arrayOf utilities for indexed collections.", references: ["https://kotlinlang.org/docs/arrays.html"], video: "https://www.youtube.com/watch?v=pRiaqA9p0Cs" },
    { title: "Functions", description: "First-class constructs, can be assigned, passed, and returned.", references: ["https://kotlinlang.org/docs/functions.html"], video: "https://www.youtube.com/watch?v=ffI5XpjQ04g" },
    { title: "Classes", description: "Define custom data structures, OOP and functional features.", references: ["https://kotlinlang.org/docs/classes.html"], video: "https://www.youtube.com/watch?v=Gy32b3GpF0k" },
    { title: "Null Safety", description: "Nullable types help avoid null pointer errors.", references: ["https://kotlinlang.org/docs/null-safety.html"], video: "https://www.youtube.com/watch?v=F1szvZfKTS8" },
    { title: "Coroutines", description: "Lightweight concurrency for async programming.", references: ["https://kotlinlang.org/docs/coroutines-overview.html"], video: "https://www.youtube.com/watch?v=_hfBv0a09Jc" },
    { title: "Collections", description: "Standard APIs for List, Set, Map.", references: ["https://kotlinlang.org/docs/collections-overview.html"], video: "https://www.youtube.com/watch?v=3n1Y9YFG9Eo" },
    { title: "Interfaces", description: "Contracts for shared implementations.", references: ["https://kotlinlang.org/docs/interfaces.html"], video: "https://www.youtube.com/watch?v=AcJmeUAkb2w" },
    { title: "Extensions", description: "Add functions to existing classes.", references: ["https://kotlinlang.org/docs/extensions.html"], video: "https://www.youtube.com/watch?v=sXLQv1hksjU" },
    { title: "Data Classes", description: "Short syntax for POJOs with equals/hashCode/toString.", references: ["https://kotlinlang.org/docs/data-classes.html"], video: "https://www.youtube.com/watch?v=_hfBv0a09Jc" }
  ],
  lua: [
    { title: "Variables", description: "Dynamic typing, global and local variables.", references: ["https://www.tutorialspoint.com/lua/lua_variables.htm"], video: "https://www.youtube.com/watch?v=iMacxZQMPXs" },
    { title: "Tables", description: "Associative array, main data structure.", references: ["https://www.tutorialspoint.com/lua/lua_tables.htm"], video: "https://www.youtube.com/watch?v=E4YtG_7yAxE" },
    { title: "Functions", description: "Reusable logic, first-class values, closures.", references: ["https://www.tutorialspoint.com/lua/lua_functions.htm"], video: "https://www.youtube.com/watch?v=As4HqeySpI4" },
    { title: "Loops", description: "for, while, repeat-until constructs for iteration.", references: ["https://www.tutorialspoint.com/lua/lua_loops.htm"], video: "https://www.youtube.com/watch?v=LkYD0FFgkpg" },
    { title: "Metatables", description: "Custom behaviors for tables (operator overloading, etc).", references: ["https://www.tutorialspoint.com/lua/lua_metatables.htm"], video: "https://www.youtube.com/watch?v=7CXaFyygP2k" },
    { title: "Coroutines", description: "Lua's light-weight OS threads.", references: ["https://www.tutorialspoint.com/lua/lua_coroutines.htm"], video: "https://www.youtube.com/watch?v=LkYD0FFgkpg" },
    { title: "Modules", description: "Organize reusable chunks of code.", references: ["https://www.lua.org/manual/5.1/manual.html#5.3"], video: "https://www.youtube.com/watch?v=q1B487JAjBc" },
    { title: "String Ops", description: "String concatenation, pattern matching, formatting.", references: ["https://www.tutorialspoint.com/lua/lua_strings.htm"], video: "https://www.youtube.com/watch?v=E4YtG_7yAxE" },
    { title: "File IO", description: "Read, write, and modify files.", references: ["https://www.tutorialspoint.com/lua/lua_files_io.htm"], video: "https://www.youtube.com/watch?v=As4HqeySpI4" },
    { title: "OOP", description: "Tables and metatables enable object-oriented patterns.", references: ["https://www.tutorialspoint.com/lua/lua_object_oriented.htm"], video: "https://www.youtube.com/watch?v=7CXaFyygP2k" }
  ],
  r: [
    { title: "Variables", description: "Assign using <- or =.", references: ["https://www.datamentor.io/r-programming/variables/"], video: "https://www.youtube.com/watch?v=_V8eKsto3Ug" },
    { title: "Vectors", description: "1D homogeneous data structure.", references: ["https://www.datamentor.io/r-programming/vector/"], video: "https://www.youtube.com/watch?v=E1L3f2C9N9A" },
    { title: "Functions", description: "Define reusable code blocks.", references: ["https://www.datamentor.io/r-programming/user-defined-function/"], video: "https://www.youtube.com/watch?v=s3e8acKZ9Wk" },
    { title: "DataFrames", description: "2D tabular data structure.", references: ["https://www.datamentor.io/r-programming/data-frame/"], video: "https://www.youtube.com/watch?v=5r2YRHaoIiw" },
    { title: "Plots", description: "Visualize data with base plot, ggplot2, etc.", references: ["https://www.datamentor.io/r-programming/plotting/"], video: "https://www.youtube.com/watch?v=he63lj8z4sw" },
    { title: "Loops", description: "for, while for repetitive tasks.", references: ["https://www.datamentor.io/r-programming/loops/"], video: "https://www.youtube.com/watch?v=w81J7bZtl8Y" },
    { title: "Lists", description: "Generalized containers for objects with heterogeneous types.", references: ["https://www.datamentor.io/r-programming/list/"], video: "https://www.youtube.com/watch?v=uHqLp41b8M0" },
    { title: "Statistics", description: "Built-in functions: mean, median, sd, etc.", references: ["https://www.datamentor.io/r-programming/statistics/"], video: "https://www.youtube.com/watch?v=cf8ZB3X8RLo" },
    { title: "Packages", description: "Extend R with install.packages()", references: ["https://www.datamentor.io/r-programming/packages/"], video: "https://www.youtube.com/watch?v=rNwYf6ASyRI" },
    { title: "String Ops", description: "manipulate text with strsplit, paste, substr.", references: ["https://www.datamentor.io/r-programming/string/"], video: "https://www.youtube.com/watch?v=JzhlfbVmXAE" }
  ],
  dart: [
    { title: "Variables", description: "var, final, const; strong but flexible typing.", references: ["https://dart.dev/language/variables"], video: "https://www.youtube.com/watch?v=Ej_Pcr4uC2Q" },
    { title: "Lists", description: "Homogenous ordered collections.", references: ["https://dart.dev/guides/libraries/library-tour#lists"], video: "https://www.youtube.com/watch?v=Ej_Pcr4uC2Q" },
    { title: "Functions", description: "Support for named, anonymous, arrow, and higher-order.", references: ["https://dart.dev/language/functions"], video: "https://www.youtube.com/watch?v=Ej_Pcr4uC2Q" },
    { title: "Classes", description: "Single inheritance, interface, mixins.", references: ["https://dart.dev/language/classes"], video: "https://www.youtube.com/watch?v=Ej_Pcr4uC2Q" },
    { title: "Async", description: "Future, Stream, and async/await.", references: ["https://dart.dev/codelabs/async-await"], video: "https://www.youtube.com/watch?v=Ej_Pcr4uC2Q" },
    { title: "Mixins", description: "Reusable class code with mixin.", references: ["https://dart.dev/language/mixins"], video: "https://www.youtube.com/watch?v=Ej_Pcr4uC2Q" },
    { title: "Generics", description: "Type-safe collections and code reuse.", references: ["https://dart.dev/language/generics"], video: "https://www.youtube.com/watch?v=Ej_Pcr4uC2Q" },
    { title: "Error Handling", description: "try/catch/finally and error hierarchy.", references: ["https://dart.dev/guides/language/language-tour#error-handling"], video: "https://www.youtube.com/watch?v=Ej_Pcr4uC2Q" },
    { title: "Extensions", description: "Add methods on types.", references: ["https://dart.dev/guides/language/extension-methods"], video: "https://www.youtube.com/watch?v=Ej_Pcr4uC2Q" },
    { title: "Isolates", description: "Thread-like concurrency for CPU-intensive tasks.", references: ["https://dart.dev/language/concurrency"], video: "https://www.youtube.com/watch?v=Ej_Pcr4uC2Q" }
  ],
  scala: [
    { title: "Variables", description: "val (immutable) and var (mutable).", references: ["https://docs.scala-lang.org/tour/variables.html"], video: "https://www.youtube.com/watch?v=_gFHEDq17yE" },
    { title: "Collections", description: "Immutable and mutable, List, Vector, Map, Set...", references: ["https://docs.scala-lang.org/overviews/collections/introduction.html"], video: "https://www.youtube.com/watch?v=1jLq6yWQ8eA" },
    { title: "Functions", description: "First-class, higher-order, lambdas and methods.", references: ["https://docs.scala-lang.org/tour/functions.html"], video: "https://www.youtube.com/watch?v=1lHkOFAbG_s" },
    { title: "Classes", description: "OOP support, custom objects.", references: ["https://docs.scala-lang.org/tour/classes.html"], video: "https://www.youtube.com/watch?v=st8IztTqf1o" },
    { title: "Pattern Matching", description: "Destructure & analyze data.", references: ["https://docs.scala-lang.org/tour/pattern-matching.html"], video: "https://www.youtube.com/watch?v=R2DHtTtFzXE" },
    { title: "Traits", description: "Mixins and contracts for code reuse.", references: ["https://docs.scala-lang.org/tour/traits.html"], video: "https://www.youtube.com/watch?v=K9YCk9bmadM" },
    { title: "Generics", description: "Parameterized types for functions and classes.", references: ["https://docs.scala-lang.org/tour/generic-classes.html"], video: "https://www.youtube.com/watch?v=fvB0WWpIV2g" },
    { title: "Futures", description: "Concurrent programming with Futures.", references: ["https://docs.scala-lang.org/overviews/core/futures.html"], video: "https://www.youtube.com/watch?v=gWaQFQX46R8" },
    { title: "Implicits", description: "Implicit parameters and conversions.", references: ["https://docs.scala-lang.org/tutorials/FAQ/finding-implicits.html"], video: "https://www.youtube.com/watch?v=R2DHtTtFzXE" },
    { title: "Streams", description: "Lazy sequences of elements.", references: ["https://docs.scala-lang.org/overviews/collections/streams.html"], video: "https://www.youtube.com/watch?v=gWaQFQX46R8" }
  ],
  assembly: [
    { title: "Registers", description: "CPU internal variables for math, pointer, function returns.", references: ["https://en.wikibooks.org/wiki/X86_Assembly/Registers"], video: "https://www.youtube.com/watch?v=yz7nYlnXLfE" },
    { title: "MOV", description: "Basic instruction to move data between registers/memory.", references: ["https://en.wikibooks.org/wiki/X86_Assembly/Data_Transfer"], video: "https://www.youtube.com/watch?v=yz7nYlnXLfE" },
    { title: "ADD SUB", description: "Arithmetic operations in assembly.", references: ["https://en.wikibooks.org/wiki/X86_Assembly/Arithmetic"], video: "https://www.youtube.com/watch?v=yz7nYlnXLfE" },
    { title: "Jumps", description: "Control flow: JMP, JZ, JNZ, etc.", references: ["https://en.wikibooks.org/wiki/X86_Assembly/Control_Flow"], video: "https://www.youtube.com/watch?v=yz7nYlnXLfE" },
    { title: "Stack", description: "Push/pop and call/ret for subroutine management.", references: ["https://en.wikibooks.org/wiki/X86_Assembly/Stack"], video: "https://www.youtube.com/watch?v=yz7nYlnXLfE" },
    { title: "Procedures", description: "Assembly subroutines; save and restore CPU state.", references: ["https://en.wikibooks.org/wiki/X86_Assembly/Procedures"], video: "https://www.youtube.com/watch?v=yz7nYlnXLfE" },
    { title: "Memory", description: "Address types and access patterns.", references: ["https://en.wikibooks.org/wiki/X86_Assembly/Memory"], video: "https://www.youtube.com/watch?v=yz7nYlnXLfE" },
    { title: "Interrupts", description: "Calling OS or BIOS services (int instruction).", references: ["https://en.wikibooks.org/wiki/X86_Assembly/Interrupts"], video: "https://www.youtube.com/watch?v=yz7nYlnXLfE" },
    { title: "Flags", description: "Condition codes for branches or arithmetic.", references: ["https://en.wikibooks.org/wiki/X86_Assembly/Flags"], video: "https://www.youtube.com/watch?v=yz7nYlnXLfE" },
    { title: "Hello World", description: "Classic first program in raw assembly.", references: ["https://en.wikibooks.org/wiki/X86_Assembly/Hello_World"], video: "https://www.youtube.com/watch?v=yz7nYlnXLfE" }
  ],
  basic: [
    { title: "Variables", description: "Let statements to store numbers or strings.", references: ["https://www.cs.nmsu.edu/~rth/cs/cs471/il/basics.html"], video: "" },
    { title: "Print", description: "Output values with PRINT.", references: ["https://www.cs.columbia.edu/~sedwards/classes/2022/4840-spring/lab1/basic.html"], video: "" },
    { title: "Input", description: "Get user data with INPUT.", references: ["https://en.wikibooks.org/wiki/BASIC_Programming/Input"], video: "" },
    { title: "If Then", description: "Conditional statements for simple decision making.", references: ["https://en.wikibooks.org/wiki/BASIC_Programming/Control_Structures"], video: "" },
    { title: "For Loop", description: "REPEAT blocks using FOR...NEXT.", references: ["https://en.wikibooks.org/wiki/BASIC_Programming/Loops"], video: "" },
    { title: "GoTo", description: "Jump in program control flow.", references: ["https://www.cs.columbia.edu/~sedwards/classes/2022/4840-spring/lab1/basic.html"], video: "" },
    { title: "Arrays", description: "Indexed container for same-type data.", references: ["https://www.cs.columbia.edu/~sedwards/classes/2022/4840-spring/lab1/basic.html"], video: "" },
    { title: "Functions", description: "Modularize code into reusable procedures.", references: ["https://en.wikibooks.org/wiki/BASIC_Programming/Procedures_and_Functions"], video: "" },
    { title: "File IO", description: "Read and write files from program.", references: ["https://www.thebible.net/kidspace/BASICfilenumber.html"], video: "" },
    { title: "Graphics", description: "Draw shapes, images, use PLOT functions.", references: ["https://en.wikibooks.org/wiki/BASIC"], video: "" }
  ],
  python: [
    { title: "Variables", description: "Dynamically typed storage for any object or number.", references: ["https://docs.python.org/3/tutorial/introduction.html#using-python-as-a-calculator"], video: "https://www.youtube.com/watch?v=rfscVS0vtbw" },
    { title: "Lists", description: "Flexible, ordered collections of values.", references: ["https://docs.python.org/3/tutorial/introduction.html#lists"], video: "https://www.youtube.com/watch?v=W8KRzm-HUcc" },
    { title: "Loops", description: "for, while, and comprehensions.", references: ["https://docs.python.org/3/tutorial/controlflow.html#for-statements"], video: "https://www.youtube.com/watch?v=6iF8Xb7Z3wQ" },
    { title: "Functions", description: "Reusable code with def.", references: ["https://docs.python.org/3/tutorial/controlflow.html#defining-functions"], video: "https://www.youtube.com/watch?v=9Os0o3wzS_I" },
    { title: "Dictionaries", description: "Mapping of key to value.", references: ["https://docs.python.org/3/tutorial/datastructures.html#dictionaries"], video: "https://www.youtube.com/watch?v=daefaLgNkw0" },
    { title: "Classes", description: "Object-oriented programming.", references: ["https://docs.python.org/3/tutorial/classes.html"], video: "https://www.youtube.com/watch?v=apACNr7DC_s" },
    { title: "File IO", description: "Read and write files with open().", references: ["https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files"], video: "https://www.youtube.com/watch?v=Uh2ebFW8OYM" },
    { title: "Modules", description: "Group code for reuse; import standard or custom modules.", references: ["https://docs.python.org/3/tutorial/modules.html"], video: "https://www.youtube.com/watch?v=CqvZ3vGoGs0" },
    { title: "Exceptions", description: "try/except/finally to handle errors.", references: ["https://docs.python.org/3/tutorial/errors.html"], video: "https://www.youtube.com/watch?v=NIWwJbo-9_8" },
    { title: "APIs", description: "Work with HTTP APIs using requests/urllib.", references: ["https://realpython.com/python-requests/"], video: "https://www.youtube.com/watch?v=tb8gHvYlCFs" }
  ],
  javascript: [
    { title: "Variables", description: "let, const, var for storing data.", references: ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Declarations"], video: "https://www.youtube.com/watch?v=W6NZfCO5SIk" },
    { title: "Arrays", description: "Ordered collections that can grow and shrink.", references: ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array"], video: "https://www.youtube.com/watch?v=R8rmfD9Y5-c" },
    { title: "Functions", description: "Reusable blocks, arrow, and classic forms.", references: ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions"], video: "https://www.youtube.com/watch?v=PkZNo7MFNFg" },
    { title: "DOM", description: "Interact with page elements.", references: ["https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model"], video: "https://www.youtube.com/watch?v=0ik6X4DJKCc" },
    { title: "Events", description: "Respond to user or system actions.", references: ["https://developer.mozilla.org/en-US/docs/Web/Events"], video: "https://www.youtube.com/watch?v=XF1_MlZ5l6M" },
    { title: "Promises", description: "Async result wrappers.", references: ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises"], video: "https://www.youtube.com/watch?v=DHvZLI7Db8E" },
    { title: "Async Await", description: "Syntactic sugar for Promises.", references: ["https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await"], video: "https://www.youtube.com/watch?v=V_Kr9OSfDeU" },
    { title: "Classes", description: "OOP with constructor, methods, fields.", references: ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes"], video: "https://www.youtube.com/watch?v=2ZphE5HcQPQ" },
    { title: "Modules", description: "import/export code structure.", references: ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules"], video: "https://www.youtube.com/watch?v=cRHQNNcYf6s" },
    { title: "Fetch API", description: "Network I/O in the browser.", references: ["https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API"], video: "https://www.youtube.com/watch?v=Oive66jrwBs" }
  ],
  typescript: [
    { title: "Types", description: "JavaScript plus static typing.", references: ["https://www.typescriptlang.org/docs/handbook/basic-types.html"], video: "https://www.youtube.com/watch?v=BwuLxPH8IDs" },
    { title: "Interfaces", description: "Define object shape and contracts.", references: ["https://www.typescriptlang.org/docs/handbook/interfaces.html"], video: "https://www.youtube.com/watch?v=DrtZaB1Bgsw" },
    { title: "Generics", description: "Abstract over types in classes or functions.", references: ["https://www.typescriptlang.org/docs/handbook/generics.html"], video: "https://www.youtube.com/watch?v=V8ldRTB_g7o" },
    { title: "Enums", description: "Named constants.", references: ["https://www.typescriptlang.org/docs/handbook/enums.html"], video: "https://www.youtube.com/watch?v=mr5xkf6zSzk" },
    { title: "Decorators", description: "Attach behavior to classes and members.", references: ["https://www.typescriptlang.org/docs/handbook/decorators.html"], video: "https://www.youtube.com/watch?v=YJ6jByLQfFw" },
    { title: "Modules", description: "import/export code structure.", references: ["https://www.typescriptlang.org/docs/handbook/modules.html"], video: "https://www.youtube.com/watch?v=ifCKeiTZhqw" },
    { title: "Classes", description: "Object-oriented code.", references: ["https://www.typescriptlang.org/docs/handbook/classes.html"], video: "https://www.youtube.com/watch?v=ZaGeU7Ow1G4" },
    { title: "Utility Types", description: "Mapped and conditional types.", references: ["https://www.typescriptlang.org/docs/handbook/utility-types.html"], video: "https://www.youtube.com/watch?v=d56mG7DezGs" },
    { title: "Async", description: "Async/await and Promise usage.", references: ["https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html"], video: "https://www.youtube.com/watch?v=V_Kr9OSfDeU" },
    { title: "Type Guards", description: "Type narrowing and protection.", references: ["https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types"], video: "https://www.youtube.com/watch?v=basx1J8IGrA" }
  ]
};

const LANGUAGE_NAMES: Record<string, string> = {
  c: "C", cpp: "C++", csharp: "C#", rust: "Rust", go: "Go", java: "Java", bash: "Bash", php: "PHP", ruby: "Ruby", swift: "Swift", kotlin: "Kotlin", lua: "Lua", r: "R", dart: "Dart", scala: "Scala", assembly: "Assembly", basic: "BASIC", python: "Python", javascript: "JavaScript", typescript: "TypeScript"
};
const LANGUAGE_COLORS: Record<string, string> = {
  c: "#5c86d4", cpp: "#f34b7d", csharp: "#178600", rust: "#dea584", go: "#00add8",
  java: "#b07219", bash: "#89e051", php: "#4f5d95", ruby: "#701516", swift: "#ffac45",
  kotlin: "#a97bff", lua: "#000080", r: "#198ce7", dart: "#00b4ab", scala: "#c22d40",
  assembly: "#6e4c13", basic: "#a179dc", python: "#3572A5", javascript: "#f1e05a", typescript: "#3178c6"
};
const LANGUAGE_DESCRIPTIONS: Record<string, string> = {
  c: "C is a general-purpose, procedural programming language that gives programmers direct control over memory and hardware.",
  cpp: "C++ is an extension of C that adds object-oriented programming. It is used in game engines, system software, and high-performance applications.",
  csharp: "C# is a modern object-oriented language developed by Microsoft, widely used for Windows apps, games with Unity, and enterprise software.",
  rust: "Rust is a systems programming language focused on memory safety and performance without a garbage collector.",
  go: "Go is a statically typed, compiled language designed at Google for simplicity, concurrency, and fast builds.",
  java: "Java is a class-based, object-oriented programming language designed to be platform-independent.",
  bash: "Bash is a Unix shell and command language used to automate tasks, manage files, and control systems via the terminal.",
  php: "PHP is a server-side scripting language especially suited to web development.",
  ruby: "Ruby is a dynamic, open-source programming language with a focus on simplicity and developer happiness.",
  swift: "Swift is a powerful and intuitive programming language for iOS and macOS development.",
  kotlin: "Kotlin is a modern, concise language for JVM and Android development.",
  lua: "Lua is a lightweight, high-level scripting language commonly embedded in games and applications.",
  r: "R is a language and environment for statistical computing and graphical visualization.",
  dart: "Dart is a client-optimized language developed by Google, primarily used with Flutter.",
  scala: "Scala combines object-oriented and functional programming on the JVM.",
  assembly: "Assembly language is a low-level programming language that maps directly to machine code.",
  basic: "BASIC is one of the earliest easy-to-learn programming languages designed for beginners.",
  python: "Python is a high-level, interpreted language known for its readability and versatile applications in data science, web development, automation, and more.",
  javascript: "JavaScript is the ubiquitous programming language of the browser, widely used for interactive website features and also supported on the server via Node.js.",
  typescript: "TypeScript is a statically-typed superset of JavaScript that brings type safety to your JS code."
};
const CODE_EXAMPLES: Record<string, Record<string, string[]>> = {
  c: {
    Variables: [
      "#include <stdio.h>",
      "int main() {",
      "  int n = 10;",
      "  float f = 5.5;",
      "  char c = 'A';",
      "  printf(\"n=%d, f=%.1f, c=%c\\n\", n, f, c);",
      "  return 0;",
      "}"
    ]
  },
  python: {
    Variables: [
      "# Python variables",
      "name = \"Alice\"",
      "age = 23",
      "height = 1.7",
      "print(f\"{name} is {age} years old and {height}m tall.\")"
    ]
  }
};

interface Term { term: string; definition: string }
interface Lesson {
  id: string; title: string; difficulty: string; explanation: string;
  keyTerms: Term[]; codeExample: string[]; expectedOutput: string;
  solution: string[]; commonMistakes: string[];
  challenge: string; challengeHint: string; challengeSolution: string[];
  terminalNote: string;
  topicDescription: string;
  references: string[];
  video?: string;
}
interface Language {
  id: string; name: string; description: string; color: string; topics: Lesson[];
}
const TERMINAL_COMMANDS: Record<string, string> = {
  python: "python filename.py",
  javascript: "node filename.js",
  typescript: "ts-node filename.ts",
  c: "gcc filename.c -o output && ./output",
  cpp: "g++ filename.cpp -o output && ./output",
  csharp: "dotnet run",
  rust: "cargo run",
  go: "go run filename.go",
  java: "javac Main.java && java Main",
  bash: "bash filename.sh",
  php: "php filename.php",
  ruby: "ruby filename.rb",
  swift: "swift filename.swift",
  kotlin: "kotlinc filename.kt -include-runtime -d output.jar && java -jar output.jar",
  lua: "lua filename.lua",
  r: "Rscript filename.R",
  dart: "dart run filename.dart",
  scala: "scala filename.scala",
  assembly: "nasm -f elf64 filename.asm && ld filename.o && ./a.out",
  basic: "run filename.bas",
};

function createLesson(
  langId: string,
  langName: string,
  topic: { title: string; description: string; references: string[]; video?: string },
  index: number
): Lesson {
  const examples = CODE_EXAMPLES[langId] ?? {};
  const codeExample = examples[topic.title] ?? [
    `# ${topic.title} in ${langName}`,
    `# This demonstrates how ${topic.title} works`,
    `print("Learning ${topic.title}")`,
  ];

  return {
    id: `${langId}-${topic.title}`.replace(/[\s+]/g, "-").toLowerCase(),
    title: topic.title,
    difficulty: index < 3 ? "Beginner" : index < 6 ? "Intermediate" : "Advanced",
    explanation: `In this lesson you'll learn about ${topic.title} in ${langName}. This concept is essential: ${topic.description} For deeper learning, see the references and video below.`,
    topicDescription: topic.description,
    references: topic.references ?? [],
    video: topic.video,
    keyTerms: [
      { term: topic.title, definition: topic.description },
      { term: "Syntax", definition: "The set of rules that define how code must be written so the computer can understand it." },
      { term: "Output", definition: "The result your program produces when it runs successfully." },
    ],
    codeExample,
    expectedOutput: `Learning ${topic.title}`,
    solution: codeExample,
    commonMistakes: [
      `Forgetting the correct syntax for ${topic.title} in ${langName}.`,
      "Not testing your code after writing it.",
      "Skipping error messages instead of reading them carefully.",
      `Not consulting documentation or references for best practices about ${topic.title}.`
    ],
    challenge: `Write a ${langName} program that demonstrates ${topic.title}. Your code should run without errors and produce visible output.`,
    challengeHint: `Look at the example code above. Think about what each line does and try writing something similar using ${topic.title}.`,
    challengeSolution: codeExample,
    terminalNote: `Run this file with: ${TERMINAL_COMMANDS[langId] ?? "check your language docs"}`,
  };
}
function generateLanguage(id: string): Language {
  const name = LANGUAGE_NAMES[id] ?? id;
  const topicObjs = LANGUAGE_TOPICS[id] ?? [];
  return {
    id,
    name,
    description: LANGUAGE_DESCRIPTIONS[id] ?? "",
    color: LANGUAGE_COLORS[id] ?? "#888888",
    topics: topicObjs.map((topic, idx) => createLesson(id, name, topic, idx)),
  };
}
const ALL_LANGUAGES: Language[] = Object.keys(LANGUAGE_TOPICS).map(generateLanguage);
const difficultyColor: Record<string, string> = {
  Beginner: "bg-green-500",
  Intermediate: "bg-yellow-500",
  Advanced: "bg-red-500",
};
function stepLabel(step: number) {
  const labels = ["", "Concept", "Key Terms", "Example", "Challenge", "Solution"];
  return labels[step] ?? "";
}
function CodeBlock({ codeLines, language }: { codeLines: string[]; language?: string }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    await navigator.clipboard.writeText(codeLines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }
  return (
    <div className="rounded-xl bg-zinc-900 text-zinc-50 text-sm font-mono overflow-x-auto mb-4 border border-zinc-800">
      <div className="flex justify-between items-center px-4 pt-3 pb-2 border-b border-zinc-800">
        <span className="uppercase text-xs tracking-wider text-zinc-400">{language ?? "Code"}</span>
        <button className="rounded-full px-3 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 text-white transition" onClick={handleCopy}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="px-4 py-4 overflow-x-auto">
        <code className="flex flex-col">
          {codeLines.map((line, idx) => (
            <span key={idx} className="flex">
              <span className="select-none text-zinc-600 pr-4 text-right w-8 flex-shrink-0">{idx + 1}</span>
              <span>{line}</span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
function LanguagePicker({ currentLanguageId }: { currentLanguageId: string }) {
  const router = useRouter();
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedLangId = e.target.value;
    if (selectedLangId) {
      router.push(`/language/${selectedLangId}`);
    }
  }
  return (
    <div className="mb-8 flex items-center">
      <label htmlFor="lang-picker" className="mr-3 font-semibold text-zinc-600 dark:text-zinc-300 text-sm">Select Language:</label>
      <select
        id="lang-picker"
        className="rounded px-3 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm"
        value={currentLanguageId}
        onChange={handleChange}
      >
        {ALL_LANGUAGES.map(l => (
          <option key={l.id} value={l.id}>{l.name}</option>
        ))}
      </select>
    </div>
  );
}
export default function Page() {
  const params = useParams();
  const rawId = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const id = rawId.toLowerCase();
  const language = ALL_LANGUAGES.find((l) => l.id === id);
  const [currentTopic, setCurrentTopic] = useState(0);
  const [step, setStep] = useState(1);
  const [challengeAnswer, setChallengeAnswer] = useState("");
  const [showExpected, setShowExpected] = useState(false);
  if (!language) {
    return (
      <div className="font-sans bg-zinc-50 dark:bg-black min-h-screen px-4 py-32 flex flex-col items-center">
        <div className="max-w-3xl w-full mx-auto rounded-xl bg-white dark:bg-black border border-zinc-100 dark:border-zinc-900 p-8 md:p-16">
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-4">Language not found</h1>
          <p className="text-sm text-zinc-500 mb-2">
            The URL used: <code className="bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded">{id}</code>
          </p>
          <p className="text-sm text-zinc-500 mb-6">
            Available:
            {ALL_LANGUAGES.map(l =>
              <span key={l.id} className="ml-2">
                <a
                  href={`/language/${l.id}`}
                  className="text-blue-600 dark:text-blue-400 underline hover:text-blue-900 dark:hover:text-blue-200"
                  style={{ marginRight: 6 }}
                >
                  {l.name}
                </a>
              </span>
            )}
          </p>
          <div className="mb-6">
            <LanguagePicker currentLanguageId="" />
          </div>
          <a href="/" className="rounded-full px-5 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black text-sm font-semibold inline-block">
            Return to homepage
          </a>
        </div>
      </div>
    );
  }
  const lesson = language.topics[currentTopic];
  function goStep(delta: number) {
    setStep(s => Math.min(5, Math.max(1, s + delta)));
    setShowExpected(false);
  }
  function goLesson(delta: number) {
    setCurrentTopic(tp => Math.min(language!.topics.length - 1, Math.max(0, tp + delta)));
    setStep(1);
    setChallengeAnswer("");
    setShowExpected(false);
  }
  function jumpTopic(idx: number) {
    setCurrentTopic(idx);
    setStep(1);
    setChallengeAnswer("");
    setShowExpected(false);
  }
  return (
    <div className="font-sans bg-zinc-50 dark:bg-black min-h-screen">
      <nav className="flex items-center gap-4 px-8 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
        <a href="/" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 underline">Home</a>
        <span className="text-zinc-300 dark:text-zinc-700">/</span>
        <span className="text-lg font-bold" style={{ color: language.color }}>{language.name}</span>
        <span className="text-zinc-500 text-sm">{stepLabel(step)}</span>
        <span className="ml-auto text-zinc-400 text-sm">Step {step} of 5</span>
      </nav>
      <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800">
        <div className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-300" style={{ width: `${(step / 5) * 100}%` }} />
      </div>
      <div className="flex max-w-5xl mx-auto py-10 px-4 sm:px-6 gap-6">
        <aside className="w-64 flex-shrink-0 hidden md:block">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Lessons</p>
          <ul className="space-y-1">
            {language.topics.map((t, idx) => (
              <li key={t.id}>
                <button
                  onClick={() => jumpTopic(idx)}
                  className={
                    "w-full text-left px-3 py-2 rounded-full text-sm font-medium transition " +
                    (idx === currentTopic
                      ? "text-white"
                      : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900")
                  }
                  style={idx === currentTopic ? { backgroundColor: language.color } : undefined}
                  title={t.topicDescription}
                >
                  {idx + 1}. {t.title}
                  <div className="text-xs text-zinc-400 mt-1">{t.topicDescription}</div>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <section className="flex-1">
          <div className="bg-white dark:bg-black border border-zinc-100 dark:border-zinc-900 rounded-xl shadow p-8">
            <LanguagePicker currentLanguageId={language.id} />
            {step === 1 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold text-black dark:text-zinc-50">{lesson.title}</h2>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${difficultyColor[lesson.difficulty] ?? "bg-zinc-400"}`}>
                    {lesson.difficulty}
                  </span>
                </div>
                <p className="text-zinc-700 dark:text-zinc-200 mb-1">
                  <span className="font-semibold">About this topic: </span>
                  {lesson.topicDescription}
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 leading-7 mb-4">{lesson.explanation}</p>
                <p className="text-xs text-zinc-400">Lesson {currentTopic + 1} of {language.topics.length}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-900">{language.description}</p>
                <div className="mt-2">
                  {lesson.video && lesson.video !== "" && (
                    <div className="mb-4">
                      <iframe
                        width="100%"
                        height="320"
                        src={lesson.video.replace("watch?v=", "embed/")}
                        title={`Video - ${lesson.title}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-xl border border-zinc-200 dark:border-zinc-800"
                      />
                    </div>
                  )}
                  <p className="font-semibold text-sm text-zinc-600 dark:text-zinc-300 mt-4 mb-1">References:</p>
                  <ul className="list-disc list-inside">
                    {(lesson.references ?? []).map((ref, i) => (
                      <li key={i}>
                        <a href={ref} className="text-blue-700 dark:text-blue-300 underline" target="_blank" rel="noopener noreferrer">
                          {ref}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                <h3 className="text-lg font-semibold mb-5 text-black dark:text-zinc-50">Key Terms</h3>
                <dl className="space-y-4">
                  {lesson.keyTerms.map((kt, i) => (
                    <div key={i} className="border-l-2 border-zinc-200 dark:border-zinc-700 pl-4">
                      <dt className="font-semibold text-zinc-900 dark:text-zinc-100">{kt.term}</dt>
                      <dd className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">{kt.definition}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            {step === 3 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-black dark:text-zinc-50">Example</h3>
                <CodeBlock codeLines={lesson.codeExample} language={language.name} />
                <p className="text-sm text-zinc-500 mt-2">
                  Expected output: <span className="ml-1 font-mono bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded text-xs">{lesson.expectedOutput}</span>
                </p>
                <div className="mt-6">
                  <p className="font-semibold text-sm text-zinc-700 dark:text-zinc-200 mb-2">Common Mistakes</p>
                  <ul className="list-disc list-inside space-y-1">
                    {lesson.commonMistakes.map((m, i) => (
                      <li key={i} className="text-sm text-zinc-500 dark:text-zinc-400">{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {step === 4 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-black dark:text-zinc-50">Challenge</h3>
                <p className="text-zinc-700 dark:text-zinc-200 mb-4">{lesson.challenge}</p>
                <textarea
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 text-zinc-50 border border-zinc-700 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-zinc-500 resize-none"
                  rows={8}
                  value={challengeAnswer}
                  onChange={e => setChallengeAnswer(e.target.value)}
                  placeholder="Type your code here..."
                />
                <div className="flex items-center gap-3 mt-3">
                  <button
                    className="rounded-full px-5 py-2 text-sm font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black hover:bg-zinc-700 dark:hover:bg-zinc-300 transition"
                    onClick={() => setShowExpected(true)}
                  >
                    Run
                  </button>
                  {lesson.challengeHint && (
                    <span className="text-xs text-zinc-400">Hint: {lesson.challengeHint}</span>
                  )}
                </div>
                {showExpected && (
                  <div className="mt-4 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-1">Expected Output:</p>
                    <p className="font-mono text-sm text-zinc-600 dark:text-zinc-400">{lesson.expectedOutput}</p>
                  </div>
                )}
              </div>
            )}
            {step === 5 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-black dark:text-zinc-50">Solution</h3>
                <CodeBlock codeLines={lesson.solution} language={language.name} />
                <div className="mt-6">
                  <p className="font-semibold text-sm text-zinc-700 dark:text-zinc-200 mb-2">Challenge Solution</p>
                  <CodeBlock codeLines={lesson.challengeSolution} language={language.name} />
                </div>
                <div className="mt-6 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Terminal Command</p>
                  <p className="font-mono text-sm text-zinc-700 dark:text-zinc-200">{lesson.terminalNote}</p>
                </div>
                <div className="mt-8">
                  {lesson.video && lesson.video !== "" && (
                    <>
                      <p className="font-semibold text-sm text-zinc-600 dark:text-zinc-300 mt-4 mb-1">Topic Video:</p>
                      <iframe
                        width="100%"
                        height="320"
                        src={lesson.video.replace("watch?v=", "embed/")}
                        title={`Video - ${lesson.title}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-xl border border-zinc-200 dark:border-zinc-800"
                      />
                    </>
                  )}
                  <p className="font-semibold text-sm text-zinc-600 dark:text-zinc-300 mt-4 mb-1">References:</p>
                  <ul className="list-disc list-inside">
                    {(lesson.references ?? []).map((ref, i) => (
                      <li key={i}>
                        <a href={ref} className="text-blue-700 dark:text-blue-300 underline" target="_blank" rel="noopener noreferrer">
                          {ref}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-2 mt-10">
              <button
                className="rounded-full px-4 py-2 text-sm font-semibold bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-40 transition"
                onClick={() => goStep(-1)} disabled={step === 1}
              >Previous Step</button>
              <button
                className="rounded-full px-4 py-2 text-sm font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-40 transition"
                onClick={() => goStep(1)} disabled={step === 5}
              >Next Step</button>
              <span className="flex-1" />
              <button
                className="rounded-full px-4 py-2 text-sm font-semibold bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-40 transition"
                onClick={() => goLesson(-1)} disabled={currentTopic === 0}
              >Previous Lesson</button>
              <button
                className="rounded-full px-4 py-2 text-sm font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-40 transition"
                onClick={() => goLesson(1)} disabled={currentTopic === language.topics.length - 1}
              >Next Lesson</button>
            </div>
            <div className="mt-6 text-center">
              <a href="/" className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 underline text-sm transition">Back to homepage</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}