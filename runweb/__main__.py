#!/usr/bin/env python3

import sys

try:
    from runweb import main
except ImportError:
    from runweb.runweb import main

sys.exit(main())
