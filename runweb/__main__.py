#!/usr/bin/env python3

# pylint: disable=C0114

import sys

try:
    from runweb import main
except ImportError:
    from runweb.runweb import main

sys.exit(main())
